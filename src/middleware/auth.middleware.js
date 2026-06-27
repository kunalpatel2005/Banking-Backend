const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");
const tokenblacklistModel = require("../models/blackList.model.js")

async function authmiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "user is not logedIN",
    });
  }
  const isblacklist = await tokenblacklistModel.findOne({
    token
  })
  if(isblacklist){
    res.status(401).json({
      message:"you do not have any acces, token is blacklisted"
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("ye raha decoded", decoded);
    const user = await userModel.findById(decoded.userid);

    req.user = user;
    console.log("req after saving user", req.user);
    return next();
  } catch (e) {
    return res.status(401).json({
      message: "token is invalid",
    });
  }
}
//ye wala middleware jb run hoga jb peyment just start krna ho or system account se start kr rahe ho
async function authsystemmiddleware(req,res, next) {
  const token = req.cookies.token || req.header.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unathurized access, token is missing",
    });
  }
  const isblacklist = await tokenblacklistModel.findOne({
    token
  })
  if(isblacklist){
    res.status(401).json({
      message:"you can't make a payment"
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userid).select("+systemUser");
    if (!user.systemUser) {
      return res.status(403).json({
        message: "you are not a system user",
      });
    }
    req.user = user;
    return next();
  } catch (e) {
    console.log("this is the error", e);
    return res.status(401).json({
      message: "unauthorized access,token is invalid",
    });
  }
}

module.exports = { authmiddleware, authsystemmiddleware };
