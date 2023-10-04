const express = require('express');
const app = express.Router();


const adminLoginModel = require(__dirname+'/../../Models/admin_login');


app.get('/',(req,res)=>{
  
      res.render('admin/auth/admin_login',{messages: req.flash('Please provide an email and password')});
});

app.post('/login',async (req,res)=>{
       const {email,password} = req.body;
       if(!email || !password){
            req.flash('messages','Please provide an email and password');
            res.redirect('/admin');
            
       }else{
            const matchData = await adminLoginModel.findOne({email:email}).populate('roles_id');
            if(matchData &&  password === matchData.password){
              if(matchData.status == 1){
              req.session.user = matchData;
              console.log(req.session.user);
              req.flash('msg','Your Successfully Login!');
              res.redirect('/dashboard/dashboard'); 
              }else{
                req.flash('messages','Your Profile had been blocked!');
                res.redirect('/admin');
              }
            }else{
              
              req.flash('messages','Invalid email or password');
              res.redirect('/admin');
                
            }
       }
 });


 app.get('/logout',(req,res)=>{
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin');
    }
  });
 })

module.exports = app;