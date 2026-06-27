const accountmodel = require("../models/account.model");
const ledgerModel = require("../models/ladger.model");
const mongoose = require("mongoose");

async function createaccount(req,res){
    const user = req.user;
    const finduser = await accountmodel.findOne({user:user._id})
    if(finduser){
        res.status(422).json({
            message:"account already exist"
        })
        return
    }
    const account = await accountmodel.create({
        user:user._id
    })
    res.status(201).json({
        account
    })
}
async function getuseraccount(req,res){
    const account = await accountmodel.find({user:req.user._id})
    res.status(200).json({
        account
    })
}
async function getuserbalance(req,res){
    const account = await accountmodel.findOne({user:req.user._id})
    if(!account){
        return res.status(400).json({
            message:"account not found or create a account first"
        })
    }
    // console.log(account)
       console.log(account);
console.log(account instanceof accountmodel);
console.log(typeof account.getBalance);
    const balance = await account.getBalance();
 
    console.log("balance:", balance)
    if(!balance){
        return res.status(400).json({
            message:"balance not found"
        })
    }
    res.status(200).json({
        balance:balance
    })
}
module.exports = {createaccount,getuseraccount,getuserbalance} 
