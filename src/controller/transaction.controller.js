const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ladger.model");
const mongoose = require("mongoose");
const accountmodel = require("../models/account.model");
const emailservice = require("../services/email.service")

/** 
  * - following steps are taken to create a transaction
 * 1.validate req
 * 2.validate ideompotencyket
 * 3.check account status
 * 4.derive sender balance from ledger
 * 5.crete transaction(pending)
 * 6.create debit ledger entry
 * 7. create credit ledger entry
 * 8.mark transaction completed
 * 9.commit mongodb session
 * 10.send email notification
  
  */
async function createTransaction(req, res) {
  const { fromaccount, toaccount, amount, idempotencykey } = req.body;
  if (!fromaccount || !toaccount || !amount || !idempotencykey) {
    return res.status(400).json({
      message: " specific detailes are not provided",
    });
  }
  const fromuseraccount = await accountmodel.findOne({
    _id: fromaccount,
  });
  const touseraccount = await accountmodel.findOne({
    _id: toaccount,
  });
  if (!fromuseraccount || !touseraccount) {
    res.status(400).json({
      message: "invalid account details",
    });
  }
  const istransactionalreadyexist = await transactionModel.findOne({
    idempotencykey: idempotencykey,
  });
  if(istransactionalreadyexist) {
    if(istransactionalreadyexist.status === "COMPLETE") {
      return res.status(200).json({
        message: "transaction already completed , pls change the idempotencykey for another transaction",
        transaction: istransactionalreadyexist,
      });
    }
    if(istransactionalreadyexist.status === "PENDING") {
      return res.status(200).json({
        message: "transaction status is in pending",
      });
    }
    if(istransactionalreadyexist.status === "FAILED") {
      return res.status(500).json({
        message: "transaction status is failed",
      });
    }
    if(istransactionalreadyexist.status === "REVERSED") {
      return res.status(500).json({
        message: "transaction  is reversed",
      });
    }
  }
  if(fromuseraccount.status!="ACTIVE"|| touseraccount.status!="ACTIVE"){
    return res.status(500).json({
        message:"account mayy be frozen or blocked"
    })
  }

  /**
   * 4.derive sender balance from ledger
   */
  const balance = await fromuseraccount.getBalance()
  if(balance<amount){
    return res.status(400).json({
      message:`insufficiant balance. current balance is${balance}. requested balance is${amount}`
    })
  }
/**
 *  5.crete transaction(pending)
 */
let transaction;
try{
  const session = await mongoose.startSession()
  session.startTransaction()
   transaction =(await transactionModel.create([{
    fromaccount,
    toaccount,
    amount,
    idempotencykey,
    status:"PENDING"
  }],{session}))[0]

  const DebitLedgerEntry=await ledgerModel.create([{
    account:fromaccount,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"
  }],{session})

//man lo ki transaction ke doran amount to deduct ho jaye lekin bich me kahi atk jaye ya time lg jaye, to fir same time pe agr same key se koi req kre to transaction nhi ho isliye hm kuch code likhnge
//below code is to create temporary delay in the transaction , just for understanding 
  await(()=>{
    return new Promise((resolve)=> setTimeout(resolve,15*1000))
  })()

  const CreditLedgerEntry=await ledgerModel.create([{
    account:toaccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
  }],{session})

transaction.status="COMPLETE"
await transactionModel.findOneAndUpdate(
  {_id:transaction._id},
  {status:"COMPLETE"},
  {session}
)


await session.commitTransaction()
session.endSession()
}catch(e){
  return res.status(400).json({
    message:"Your transaction is under process, pls try after some time"
  })
}
/**
 * 10.send email notification
 */
   await emailservice.sendtransactionemail(req.user.email,req.user.name,amount,touseraccount)
   return res.status(201).json({
    message:"transaction completed successfully",
    transaction
   })
}
//ye wala controller System user ke liye heee jb transaction start krna ho 
async function createinitialfundstransaction(req,res){
const {toaccount,amount,idempotencykey}= req.body
if (!toaccount || !amount || !idempotencykey) {
    return res.status(400).json({
      message: " specific detailes are not provided",
    });
  }

  const touseraccount = await accountmodel.findOne({
    _id: toaccount,
  });
  if (!touseraccount) {
    res.status(400).json({
      message: "invalid account details",
    });
  }
  if(touseraccount.status != "ACTIVE"){
    return res.status(400).json({
      message:"user account may be bloked or deactivated"
    })
  }
  const fromuseraccount = await accountmodel.findOne({
  
    user:req.user._id
  })
if(!fromuseraccount){
  return res.status(400).json({
    messgae:"no system account found"
  })
}
const session = await mongoose.startSession()
 session.startTransaction();
 const transaction = new transactionModel({
    fromaccount:fromuseraccount._id,
    toaccount,
    amount,
    idempotencykey,
    status:"PENDING"
  })

  const DebitLedgerEntry=await ledgerModel.create([{
    account:fromuseraccount._id,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"
  }],{session})
  const CreditLedgerEntry=await ledgerModel.create([{
    account:toaccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
  }],{session})
transaction.status="COMPLETE"
await transaction.save({session})


await session.commitTransaction()
session.endSession()
return res.status(201).json({
  message:"initial fund transaction completed succesfull",
  transaction:transaction
})
}
module.exports = {createTransaction,createinitialfundstransaction}