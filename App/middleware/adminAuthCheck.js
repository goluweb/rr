const express = require('express');
const app = express();




const sessionAdminAuth = (req,res,next)=>{

    if( req.session.user){
   
        next();
    }else{
        req.flash('messages','Please Login First!');
        res.redirect('/admin');
    }
}

module.exports = sessionAdminAuth;