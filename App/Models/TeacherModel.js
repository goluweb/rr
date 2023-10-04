const { Types } = require('mongoose');
const database = require(__dirname+'/../../config/Database');

const teacher = database.Schema({

    user_id:{
        type:database.Schema.Types.ObjectId,
        ref:'admin_logins',
    
    },

    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
       
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    assign_course:[{
        type:database.Schema.Types.ObjectId,
        ref:'playList', 
      
    }],
    exprience:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    bio:{
             type:String
    },
    status:{
        type:Number,
        default:2,
        required:true
    },
    added_on:{
          type:Date,
          default:new Date(),
          required:true
    }

});
teacher.set('toObject', { virtuals: true });
const teacherModel = database.model('teacherModel',teacher);

module.exports=teacherModel;