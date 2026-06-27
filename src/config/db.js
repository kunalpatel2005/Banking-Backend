const  mongoose  = require("mongoose")
const dns = require("dns")

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])
async function connectDB(){
    try{
        console.log(process.env.MONGODB_URI)
           await mongoose.connect(process.env.MONGODB_URI)

           console.log("database connected successfully")
    } catch(e){
        console.log("this is error while connecting",e)
        process.exit(1)
    }
}
 module.exports= connectDB
