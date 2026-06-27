const express = require ("express")
const router = express.Router()
const middleware = require("../middleware/auth.middleware")
const transactioncontroller = require("../controller/transaction.controller")

router.post("/",middleware.authmiddleware,transactioncontroller.createTransaction)
router.post("/system/initial-fund",middleware.authsystemmiddleware, transactioncontroller.createinitialfundstransaction)
module.exports = router