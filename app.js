// import to the express and use
 const express = require("express")
 const app = express()
 //cors policy
 const cors = require("cors")
 require("dotenv").config()
 require("./db/db")
//Port
const port = process.env.PORT
//importing routers here
    const userRoute = require("./router/user")
    const appointmentRoute = require("./router/appointment")

 //creating middleware here
 app.use(express.json())

// creating cors policy
app.use(cors())
 //using to router as middleware
  app.use("/api/user", userRoute)
  app.use("/api", appointmentRoute)
  app.use("",(req,res, next)=>{
      res.status(400).json({
          msg:"Url Not Found!"
      })
      next()
  })
 app.listen(4000, ()=>console.log(`this server is runing ${port}`))
 