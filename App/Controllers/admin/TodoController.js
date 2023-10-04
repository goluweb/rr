const express = require('express');
const app = express.Router();
const inArray = require('in-array'); 
const todoModel = require(__dirname+'/../../Models/TodoModel');
const todofile = require(__dirname+'/../../middleware/uploadImage');
const mongoosePaginate = require('mongoose-paginate-v2');
const loginModel = require(__dirname+'/../../Models/admin_login');
const tastModel = require(__dirname+'/../../Models/taskModel');
const rolePermission = require(__dirname+'/../../middleware/PermissionCheck');


app.get('/show_todo',rolePermission('viewTodo'),async(req,res)=>{
var todoTask;
const user = await loginModel.find()
const task = await tastModel.find()

  if(req.session.user.roles_id.roles === 'admin'){
      todoTask = await todoModel.find().populate('user_id').populate('task_type').sort('-_id')
  }else{
     todoTask = await todoModel.find({user_id:req.session.user._id}).populate('user_id').populate('task_type').sort('-_id')
  }

    res.render('admin/todo/show_todo',{inArray:inArray,todoTask:todoTask,user:user,task:task});
})




app.post('/add_todo',rolePermission('addTodo'),todofile.single('file'),async(req,res)=>{
   const { task , description} = req.body;

   let taskType = null;
   if(task && task !== ''){
     taskType = task;
   }

   await todoModel.create({
    user_id:req.session.user._id,
    task_type:taskType,
    file: typeof req.file !== 'undefined' && req.file !== null ?  req.file.path :'',
    discription:description
   });

   const referer = req.headers.referer || '/';
   res.redirect(referer);
})


app.get('/delete_todo/:id',rolePermission('deleteTodo'),async(req,res)=>{
  const {id} = req.params;
  await todoModel.deleteOne({_id:id})
  res.redirect('/todo/show_todo');
})


app.post('/filter',rolePermission('filterTodo'),async(req,res)=>{
  const {type,id} = req.body;
  let todoTask;
  if(type == 'user'){
    todoTask = await todoModel.find({user_id:id}).populate('user_id').populate('task_type').sort('-_id') 
  }else if(type == 'task'){
    todoTask = await todoModel.find({task_type:id}).populate('user_id').populate('task_type').sort('-_id')
  }
  const data = filter(todoTask)
  res.send(data);
})

const filter = (todoTask) => {
  let html = "";
  let vvv = null;
  todoTask.forEach((todo) => {
    html += `
      <div class="col-md-4 mt-3">
        <div class="card h-100">
          <div class="card-header">
            <div class="row align-items-center">
              <div class="col-9">
                <h5 class="mb-0"></h5>
                <div class="text-sm">
                  ${typeof todo.task_type !== "undefined" && todo.task_type !== null ? `
                    <span class="text-muted"><a href="/task/view_task/${todo.task_type._id}" target="_blank" class="text-muted">${todo.task_type.task}</a></span>` : ` <span class="text-muted"></span>` }
                </div>
              </div>
              <div class="col-3 text-end" style="padding-left: 0px;">
                <span class="badge " style="background-color: #cccbd9 !important; padding:7px">${todo.added_on.toLocaleString('default',{day:'numeric',month:'long'})}</span>
              </div>
            </div>
          </div>
          <div class="card-body">${todo.discription}</div>
          <div class="card-footer" style="display: flex; justify-content: space-between;">
            <div class="client_name">
              <span class="text-muted me-2">${todo.user_id.name}</span>
            </div>
            <div>
              <a style="text-align: end;" onclick="if (!confirm('Are you sure you want to delete this todo?')) { return false; }" href="/todo/delete_todo/${todo._id}" class="btn btn-sm btn-danger"><i class="fa fa-trash" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>`;
  });

  return html;
};



module.exports=app;