const database = require(__dirname+'/../../config/Database');

const task = database.Schema({

    task:{
        type:String,
        required:true
    },
    assign_id:[{
        type:database.Schema.Types.ObjectId,
        required:true,
        ref:'admin_logins',

    }],
    to:{
        type:Date,
        required:true        
    },
    from:{
        type:Date,
        required:true        
    },
    type:{
        type:String,
        required:true,
    },
    file:{
      type:String,
    },
    discription:{
      type:String,
    },
    assign_by:{
        type:database.Schema.Types.ObjectId,
        ref:'admin_logins',
        required:true
    },
    seen:{
         type:Number,
         default:2
    },
    task_status:{
        type:String,
        require:true
    },
    added_on:{
         type:Date,
         default:new Date(),
    }

})


const taskModel = database.model('taskModel',task);

module.exports=taskModel;