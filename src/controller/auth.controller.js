const userModel=require("../models/user.model.js")
const emailservice = require("../services/email.service")
const tokenblacklistModel = require("../models/blackList.model.js")
const jwt =require("jsonwebtoken")
// user register controller and POST- api/auth/register pe use hoga and can create acount
async function userRegisterController(req,res){
    const {email,password,name}= req.body

    const isExist = await userModel.findOne({
        email:email
    })
    if(isExist){
        return res.status(422).json({
            message:"user already exist with this email",
            status:"failed"
        })
    }
    const user = await userModel.create({
        email,password,name
    })
    
    const token = jwt.sign({userid:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token)
    res.status(201).json({
        message:"registeration successful",
        user:{
            _id:user._id,
            email: user.email,
            name:user.name
        },
        token
    })
    await emailservice.sendregisteremail(user.email,user.name)
}
async function userlogin(req,res){
        const {email,password}= req.body
        const user = await userModel.findOne({ email }).select("+password")
        if(!user){
            return res.status(401).json({
                message:"email and password is invailid"
            })
        }
       const isvalidpassword= await user.comparePassword(password)

       if(!isvalidpassword){
         return res.status(401).json({
                message:"Your Email or Password is Invalid"
            })
       }
    const token = jwt.sign({userid:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token)
    res.status(200).json({
        message:"Login successful",
        user:{
        _id:user._id,
        email:user.email,
        name:user.name
        },
        token
    })
}
async function userlogout(req,res){
const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await tokenblacklistModel.create({
        token:token
     })
      res.cookie("token","")
      res.status(200).json({
        message:"user LogOut successfully"
      })
}




module.exports = {userRegisterController,userlogin,userlogout}