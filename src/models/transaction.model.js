const mongoose = require ("mongoose") 


const transactionSchema = new mongoose.Schema({
    fromaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true,   //index isliye likhte he taki jb hme databse se ek perticular account ka transation dekhna ho to jaldi se fetch ho jaye
    },
    toaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true,   //index isliye likhte he taki jb hme databse se ek perticular account ka transation dekhna ho to jaldi se fetch ho jaye
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETE","FAILED","REVERSED"],
            message:"Status can be either PWNDING,COMPLETE,FAILED or REVERSED"
        },
         default:"PENDING",
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"]
    },
    idempotencykey:{
        type:String,
        required:[true,"key is required for transation"],
        index:true,
        unique:[true,"key should be unique"]
    }
},{
    timestamps:true
})

const transactionModel = mongoose.model("transaction",transactionSchema)

module.exports = transactionModel