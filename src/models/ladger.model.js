const mongoose = require ("mongoose") 
const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        requires:[true,"ledger must be associated with an account"],
        index:true,
        immutable:true //jo ledger he vo single source of truth he , isliye ye kabhi delete nhi honi chahiye
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a ledger entry"],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        requires:[true,"ledger must be associated with an transaction"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be eigther CREDIT or DEBIT"
        },
        required:[true,"ledger type is required"],
        immutable:true
    }
})

// ab dekho, ye ledger kabhi bhi update nhi hona chahiye isliye, hm hooks use krte he
function PreventLedgerModification(){
throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}
ledgerSchema.pre('findOneAndUpdate',PreventLedgerModification);
ledgerSchema.pre('findOneAndDelete',PreventLedgerModification);
ledgerSchema.pre('findOneAndReplace',PreventLedgerModification);
ledgerSchema.pre('updateMany',PreventLedgerModification);
ledgerSchema.pre('updateOne',PreventLedgerModification);
ledgerSchema.pre('remove',PreventLedgerModification); 
ledgerSchema.pre('deleteMany',PreventLedgerModification);

const ledgerModel = mongoose.model("ledger",ledgerSchema);
module.exports=ledgerModel