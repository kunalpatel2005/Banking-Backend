const mongoose = require("mongoose")

const tokenblacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required"],
        unique:[true,"toekn is already exist"]
    }
},{
    timestamps:true
})
tokenblacklistSchema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3 //3days
}
)
const tokenblacklistModel = mongoose.model("tokenblaclist",tokenblacklistSchema)

module.exports=tokenblacklistModel;