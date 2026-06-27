const { Timestamp } = require("mongodb")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema =new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is require to create a user"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"invailid email adress"],
        unique:[true,"email is already exist"]
    },
    name:{
        type:String,
        required:[true,"name is required for creating a acoount"],

    },

    password:{
        type:String,
        required:[true,"password is rerquire for creating a account"],
        minlength:[6,"password should be longer than 6 words"],
        select:false   //iska mtlb hm jb bbhi user ki query mangenge to password nhi ayega jb tk hmm nhi chahte
    } ,
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    } 
},
{
        timestamps:true   // user kb create hua or last time kb update hua , pata chal jayega
    }
)

userSchema.pre("save",async function(next){
if(!this.isModified("password")){
    return next()
 }
    const hash= await bcrypt.hash(this.password , 10)
    this.password =hash
//    return next()      yaha hm "next()" use nhi kr skte kyuki hmne async use kiya he
return 

})

//hm ek method bana rahe he jise hm authcontroller me login ke samay directly use kr lenge
userSchema.methods.comparePassword= async function(password){

    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model('user',userSchema)
module.exports = userModel