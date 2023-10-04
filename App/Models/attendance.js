var database = require(__dirname+'/../../config/Database');

const attend = new database.Schema({

    user_id:{
        type: database.Schema.Types.ObjectId,
        ref: 'admin_logins',
        required:true,
    },
    login_date:{
        type:Date,
        required:true
    },
    logout_date:{
        type:Date,
        default:''

    },
    note:{
        type:String,
    },
    present: {
        type: Boolean,
        required: true
      },
      logout: {
        type: Boolean,
        default:false,
        required: true
      }

     
})

const attendanceModel = database.model('attendance',attend)

module.exports=attendanceModel;