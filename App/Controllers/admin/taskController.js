const express = require('express');
const app =  express.Router();
const tastModel = require(__dirname+'/../../Models/taskModel');
const userModel = require(__dirname+'/../../Models/admin_login');
const imageUpload = require(__dirname+'/../../middleware/uploadImage');
const rolePermission = require(__dirname+'/../../middleware/PermissionCheck'); 
const player = require('play-sound')();
const inArray = require('in-array'); 
app.get('/show_task',rolePermission('viewTask'),async(req,res)=>{
     let task;
     let admin;
     if(req.session.user.roles_id.roles === 'admin'){
      admin='admin';
      task = await tastModel.find().sort('-_id').populate('assign_id','name').populate('assign_by');
     }else{
      task = await tastModel.find({$or: [ {assign_id:req.session.user._id},{assign_by:req.session.user._id}]}).sort('-_id').populate('assign_id','name').populate('assign_by'); 
     }

     res.render('admin/task/show_task',{task:task,admin:admin,inArray:inArray});     
})


app.post('/add_task',rolePermission('addTask'),imageUpload.single('attachment'),async(req,res)=>{
     const {task,from,to,assign_task,priority,discription,task_status}=req.body;
    
      await tastModel.create({
          task:task,
          assign_id:assign_task,
          to:to,
          from:from,
          file: typeof req.file !== 'undefined' && req.file !== null ? req.file.path : '',
          type:priority,
          discription:discription,
          task_status:task_status,
          assign_by:req.session.user._id,
     }).then(async(data)=>{
                player.play('http://localhost:3000/sound/ting.mp3', (err) => {
                if (err){
                    console.log('errr'+err)
                }
                });

                const referer = req.headers.referer || '/';
                res.redirect(referer);
     }).catch((err)=>{
          console.log(err)
     })

})



app.get('/edit_task/:id',rolePermission('editTask'),async(req,res)=>{
 const { id } = req.params;
 const data  = await tastModel.findOne({_id:id});
 const user = await  userModel.find().select('_id name')
 console.log(data);
 res.render('admin/task/edit_task',{data:data,user:user,inArray:inArray});
})


app.post('/edit_task/:id',rolePermission('editTask'),imageUpload.single('attachment'),async(req,res)=>{
const { id } = req.params; 
const {task,from,to,assign_task,priority,discription,imageUnlink,task_status}=req.body;
let imageUpload='';
if(typeof req.file == 'undefined' && req.file == null){
    imageUpload = imageUnlink;
}else{
    imageUpload = req.file.path;
}
await tastModel.updateOne({_id:id},{
    task:task,
    assign_id:assign_task,
    to:to,
    from:from,
    file:imageUpload,
    type:priority,
    discription:discription,
    task_status:task_status,
}).then(async(data)=>{
     player.play('http://localhost:3000/sound/ting.mp3', (err) => {
          if (err){
              console.log('errr'+err)
          }
          });

          res.redirect('/task/show_task')
}).catch((err)=>{
    console.log(err)
})


})


app.get('/delete_task/:id',rolePermission('deleteTask'),async(req,res)=>{
     const id=req.params.id;
     await tastModel.deleteOne({_id:id})
     res.redirect('/task/show_task');

})


app.post('/update_status',async(req,res)=>{
     const {value,id} = req.body;
     await tastModel.updateOne({_id:id},{ task_status:value })
     res.send('Status Updated!');

})


app.get('/view_task/:id',rolePermission('viewTask'),async(req,res)=>{
  const id = req.params.id;

  const data = await tastModel.findOne({_id:id}).populate('assign_id','name').populate('assign_by');
  console.log(data)
         data.assign_id.forEach(async(assignee) =>{
     if (req.session.user._id == assignee._id) {
          await tastModel.updateOne({_id:id},{seen:1})
        }
        });

  res.render('admin/task/view_task',{data:data,inArray:inArray});
})

module.exports= app;