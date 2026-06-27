const express = require ("express")
const router = express.Router()
const middleware = require("../middleware/auth.middleware")
const authcontroller = require("../controller/auth.controller")

//  POST- /api/auth/register
router.post("/register",authcontroller.userRegisterController)

router.post("/login",authcontroller.userlogin)

router.post("/logout",middleware.authmiddleware,authcontroller.userlogout)

module.exports = router