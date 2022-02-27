//import to the monggose for make the connection
 const mongoose = require("mongoose")

//mongodb url

// `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@bookingapp.2fc8g.mongodb.net/${process.env.USER_DB_NAME}?retryWrites=true&w=majority`
 const mongoAtlasUri = "mongodb://localhost:27017/bookingapp"

 try{
     mongoose.connect(
         mongoAtlasUri, {useNewUrlParser:true, useUnifiedTopology:true}
     )
     console.log("connection success")
 }catch(e){
         console.log("could not be connect!",e)
 }