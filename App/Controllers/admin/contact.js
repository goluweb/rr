const express = require('express');
const app = express.Router();
const inqueryModel = require(__dirname+'/../../Models/contact_inquary');
const rolePermission = require(__dirname+'/../../middleware/PermissionCheck'); //middleware for session check
const inArray = require('in-array'); 

app.get('/show_request',rolePermission('viewContact'),async(req,res)=>{
    const contact = await inqueryModel.find().sort('-_id')
    console.log(contact)
    res.render('admin/contact/show_contact',{contact:contact,inArray:inArray});
})

app.get('/delete_contact/:id',rolePermission('deleteContact'), async(req,res)=>{
    const id = req.params.id;
    await inqueryModel.deleteOne({_id:id})
    res.redirect('/contact/show_request');
})
module.exports=app;