const mongoose = require ("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../Models/users.js');
const { Router } = require("express");
const jwt=require('jsonwebtoken');
const { token } = require('morgan');

//POST Route
router.post("/post", async(req, response) => {
    console.log("inside the post function");
    User.find({ Email: req.body.Email })
    .exec()
        .then(user => {
            if (user.length >= 1) {
                return response.status(409).json({
                message: "Mail exists"
        });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return response.status(500).json({
                error: err
            })}
            else{const data = new User({
                Name:req.body.Name,
                Email:req.body.Email,
                MobileNo:req.body.MobileNo,
                ID:req.body.ID,
                password:hash
            })
            data.save()
                    .then(result=>{
                        console.log(result);
                        response.status(200).json({
                            message:'User created'
                        })
                    })
                    .catch(err=>{
                        console.log(err);
                        response.status(500).json({
                            error:err
                        })
                    });
        }})
    }    
    })
    //response.json("User created")
})

//User Login
router.post('/login',(req,res,next)=>{
    User.findOne({Email:req.body.Email})
    .exec()
    .then(user=>{
      if(user.length<1){
          return res.status(401),json({
              message:'Auth Failed'
          });
      }
      bcrypt.compare(req.body.password, user.password,(err,result)=>{
          if(err){
              return res.status(401).json({
                  message:'Auth Failed'
              })
          }
          if(result){
            const token=  jwt.sign({
                  email:user.Email,
                  userId:user.ID
              },
              'dollar',
              {
                  expiresIn:"1h",
              }
              )
              const refreshtoken=  jwt.sign({
                  email:user.Email,
                  userId:user.ID
              },
              'secret',
              {
                  expiresIn:"8h",
              }
              )

              return res.status(201).json({
                  message :'Auth Successfull',
                  accestoken:token,
                  refreshtoken:refreshtoken
              });


              
          }
          return res.status(401).json({
              message:'Auth Failed'
             
          });
      })
    })
    .catch();

});

//Refresh Token
router.post('/token',(req,res,next)=>{
    const refreshtoken= req.header('x-auth-token');
    console.log(refreshtoken);
 
    
    
    try {
        const decoded=jwt.verify(refreshtoken,'secret');
   //     req.userData=decoded;
        const {Email}=decoded;
        const {ID}=decoded;
        const accesstoken=  jwt.sign({
            email:{Email},
            userId:{ID}
        },
        'dollar',
        {
            expiresIn:"20s",
        }
        )
        res.json({
            access:accesstoken
        })

    } catch (err) {
        res.status(403).json({
            error:err
        })
    }
  });

//READ Route
router.get('/fetch/:ID', function(req, response){
    fetchID = req.params.ID;
    User.find(({ID:fetchID}), function(err, value) {
        if(value.length == 0)
        {
            response.send("Data does not exist");
        } else {
            response.send(value);
        }
    })
})

//UPDATE Route
router.put("/update/:ID", async(req, response) => {

    let upid = req.params.ID;
    let upname = req.body.Name;
    let upemail = req.body.Email;
    let upmobile = req.body.MobileNo;
    let uppassword = req.body.password;

    User.findOneAndUpdate({ID:upid}, {$set:{Name:upname, Email:upemail, MobileNo:upmobile, password:uppassword}},
    {new:true}, (err,data) => {
        if(err) 
        {
            response.send("Error")
        }
        else{
            if(data == null)
            {
                response.send("nothing found")
            } else {
                response.send(data)
            }
        }

    })
    
})

module.exports = router;