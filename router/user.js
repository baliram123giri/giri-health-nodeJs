const express = require ("express")
const router = express.Router()
const userCreate = require("../modal/user")
const  bcrypt = require ("bcrypt")
const {body, validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")

 //creating user router
 router.post("/user/create",
               body("fname", "Please enter your first name").notEmpty(),
               body("lname", "Please enter your last name").notEmpty(),
               body("email").notEmpty().withMessage("Please enter you email").isEmail().withMessage("Invalid email"),
               body("mobile").notEmpty().withMessage("Please enter mobile number!").isLength({min:10, max:10}).withMessage("Invalid mobile number!"),
               body("password").isLength({min:5}).withMessage('Password must be at least 5 chars long').matches(/\d/).withMessage('Password must contain a number'),
               async (req, res, next)=>{
                   try {
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                                 res.status(400).json({msg:errors.array()[0].msg})
                           }
                           else{
                            const email = await userCreate.findOne({email:req.body.email})
                                    if(email){
                                      //user error handling or email checking   
                                           res.status(400).json({
                                               msg:"Email already in use!"
                                           })
                                    }else{
                                      //user creating
                                        bcrypt.hash(req.body.password, 10, async (err, hash)=>{
                                            if(err){
                                                res.status(400).json({
                                                    msg:"Internal Server Error"
                                                })
                                            }else{
                                              const result = new userCreate({...req.body, password:hash})
                                                await result.save()
                                                res.status(200).json({
                                                    msg:"User Created Successfully!"
                                                })
                                            }
                                     })
                                    }
                              
                           }
                   } catch (error) {
                       res.status(400).json(error)
                   }
                 }
 )

//login router
    router.post("/user/login", async (req,res, next)=>{
                try {
                    const {email, password} = req.body
                    // console.log(req.body)
                      var user = await userCreate.findOne({email:email})
                       if(user){
                          const validPassword = await bcrypt.compare(password, user.password)
                              if((validPassword) && (email === user.email) ){
                                //here i remove the password property from user object
                                  user.password = undefined;
                                  const token = jwt.sign(
                                   { user},
                                   process.env.API_USER_AUTH_KEY, 
                                    {expiresIn:'24h'}
                                  )
                                  res.status(200).json({user, token:token})
                              }else{
                                    res.status(400).json({ msg:"email or password is wrong!"})
                              }
                          
                         
                        // res.status(200).json(user.password)
                       }else{
                        res.status(400).json({
                            msg:"email or password is wrong!"
                        })
                       }
                  
                } catch (error) {
                    res.status(400).json(error)
                }
    
    })

//user info getting
   router.get("/users", async (req,res,next)=>{
          try {
            var {page, size} = req.query
 
            if(!page){
              page = 1
            }
            if(!size){
              size=5
            }
           //  console.log(page, size)
           //  const limit = parseInt(size)
            userCreate.count({},function(err,count){
             userCreate.find({}, null, {}).skip(page > 0 ? ((page - 1) * size) : 0).limit(size).exec(function(err, docs) {
               if (err)
                 res.json(err);
               else{
                 var totalCount = Math.ceil(count/size)
                 res.json({
                   "data": docs, "meta":{"total": count, "pageCount": totalCount,page, size, }
                 });
               }
                
             });
            });
          } catch (error) {
              res.status(400).json(error)
          }
   })
//exporting to the router

module.exports = router