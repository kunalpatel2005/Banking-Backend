const express = require ("express")
const router = express.Router()
const middleware = require("../middleware/auth.middleware")
const accountcontroller = require("../controller/account.controller")

router.post("/",middleware.authmiddleware,accountcontroller.createaccount)

router.get("/",middleware.authmiddleware, accountcontroller.getuseraccount)

router.get("/balance",middleware.authmiddleware, accountcontroller.getuserbalance)

module.exports = router