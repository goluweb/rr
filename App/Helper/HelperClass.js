const express = require('express');
const app = express();
const userModel = require(__dirname+'/../Models/admin_login');
const tastModel = require(__dirname+'/../Models/taskModel');
const attendance = require(__dirname+'/../Models/attendance');
const moment = require('moment');



  // const rolesPermission = (roles)=>{
  //   return async (req,res)=>{
  //   const userId = req.session.user.roles_id._id;
  //   const allRoles = await rolesModel.findOne({_id:userId});

  //     if(inArray(allRoles.permission,roles)){
  //       return true;
  //     }else{
  //       return false;
  //     }
  //  }
  // }

  // const getDataFormUser = async(req,res)=>{
  //      const user = await userModel.find();
  //      return user;
  // }
  async function myTaskUser(req, res, next) {
    try {

      const users = await userModel.find().select('_id name');

      if(typeof req.session.user !== 'undefined' && req.session.user !==null ){

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
       const data = await attendance.findOne({$and: [{ login_date: { $gte: today } },{ present: true },{user_id:req.session.user._id}]});

     
       if(typeof data !== undefined && data !== null){
        console.log('atend1'+data)
          if(data.logout == false){
           res.locals.attendance = 'login_attendance';
          }else if(data.logout == true){
           res.locals.attendance = 'logout_attendance';
          }
       }else{
        console.log('atend2'+data)
         res.locals.attendance = 'absents';
       }
      
        

      const task = await tastModel.find({$and: [{assign_id: req.session.user._id}, {seen: 2}]}).sort('-_id').populate('assign_id', 'name').populate('assign_by');
     
      const uncompliteTAsk = await tastModel.find({$and: [{assign_id: req.session.user._id}, {task_status: {$ne: 'Complete'}}]}).select('_id task').sort('-_id')
      res.locals.uncompliteTAsk=uncompliteTAsk;
      res.locals.tasks = task;
      res.locals.moment= moment;
      res.locals.usersession = req.session.user;
    
      }

      res.locals.users = users;

      next();

    } catch (err) {

      next(err);
      
    }
  }

  

    
module.exports=myTaskUser
              