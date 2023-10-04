const database = require(__dirname+'/../../config/Database');

const todo = database.Schema({

    user_id:{
        type:database.Schema.Types.ObjectId,
        ref:'admin_logins'
    },
    task_type:{
        type:database.Schema.Types.ObjectId,
        ref:'taskModel',
        require: false
    },
    file:{
    type:String,
    },
    discription:{
    type:String,
    },
   added_on:{
      type:Date,
      default:new Date(),
   }
})

const todoModel = database.model('todoModel',todo);

module.exports=todoModel;