const express = require('express');
const app = express.Router()
const inqueryModel = require(__dirname+'/../../Models/contact_inquary');
const multer = require('multer');
// multer().none()
app.post('/form',multer().none(),async(req,res)=>{
    const { name,email,contact,requirement,message} = req.body;
   inqueryModel({
        name:name,
        email:email,
        contact:contact,
        requirement:requirement,
        message:message
    }).save().then((success)=>{
      console.log(success)
         res.status(200).json({'response':'success'})
       }).catch((err)=>{
         res.status(500).json(err.message)    
       })
})

module.exports=app;