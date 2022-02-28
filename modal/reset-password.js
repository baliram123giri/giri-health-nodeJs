
const { default: mongoose } = require("mongoose")

const otpSchema = new mongoose.Schema({
    email:String,
    otp:String,
    expireIn:Number
   },
   {
       timestamps:true
   }

)

const Otp = new mongoose.model("Otp", otpSchema, "Otp")

module.exports= Otp