const express = require("express")
const cookieparser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const accountrouter = require("./routes/account.routes")
const transactionrouter = require("./routes/transaction.routes")


const app = express();
app.use(express.json())
app.use(cookieparser())
app.get("/", (req, res) => {
    res.send("server is running")
})
app.use("/api/auth",authRouter)   //jo bhi req "/api/auth" ispe hit hofi vo authrouter pe jayegi
app.use("/api/accounts",accountrouter)
app.use("/api/transaction",transactionrouter)


module.exports=app