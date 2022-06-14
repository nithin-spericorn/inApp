const jwt = require('jsonwebtoken')
const db = require("../model")
require("dotenv").config({ path: "../dbconfig.env" })
//const env = process.env.NODE_ENV || 'local';
//const c=require("../config/config.json")[env]

module.exports.checkToken = async (req, res, next) => {
    
    const token = req.header('auth-token');
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "no token provided"
        })
    }
    
    try {
       
        //console.log(c.local.SECRET)
       // console.log("hai")
      
        const secret=process.env.SECRET||"secret"//c.local.SECRET/
        console.log("t",secret)
        const {email}= jwt.verify(token, secret)
        console.log("p",email)
         const result=await db.User.findOne( { email: email })
         console.log("r",result)
            if(result)
            {
                console.log("k")
               req.user = result
               console.log("o")
                return next()
                console.log("i")
            }
            else 
            {
                return res.status(401).json({
                    success: false,
                    message: "no user found"
                })
            }
        
       
    }
    catch (error) {
        //console.log(error);
        return res.status(401).json({
            success: false,
            message: "invalid token"
        })
    }
}