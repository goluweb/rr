const { Types } = require('mongoose');
const database = require(__dirname+'/../../config/Database');

const student = database.Schema({

    user_id:{
        type:database.Schema.Types.ObjectId,
        ref:'admin_logins',
    
    },

    name:{
        type:String,
        
    },
    image:{
        type:String,
       
    },
    mobile:{
        type:Number,
        
    },
    otp:{
   type:Number,
    },
    email: {
        type: String,
        required:false,
        default:null,

      },
    register:{
        type:Number,
        default:2,
    },

    password:{
        type:String,
       
    },
    assign_course:[{
        type:database.Schema.Types.ObjectId,
        ref:'playList', 
      
    }],

    address:{
        type:String,
      
    },
    class:{
        type:String,
    },
    dob:{
        type:Date
    },
    mother_name:{
       type:String
    },
    father_name:{
        type:String
    },
    state:{
        type:String
    },
    city:{
        type:String
    },
    gender:{
        type:String
    },
    center:{
        type:String
    },
    school_name:{
         type:String,
    },

    status:{
        type:Number,
        default:1,
        
    },
    added_on:{
          type:Date,
          default:new Date(),
          required:true
    }

});

student.virtual('assignment',{
    ref: 'assignment',
    localField: '_id',
    foreignField:'chapter_id',
    justOne: false,
});

student.set('toObject', { virtuals: true });

const studentModel = database.model('studentModel',student);

module.exports=studentModel;