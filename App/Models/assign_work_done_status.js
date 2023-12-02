const database = require(__dirname + '/../../config/Database');


const work = new database.Schema({


student_id:{
    type:database.Schema.Types.ObjectId,
    ref:'studentModel',
    required:[true,'Student is required']
},

assignment_done:{
    type:database.Schema.Types.ObjectId,
    ref:'assignment' ,
    required:[true,'assignment is required']
},

status:{
   type:Number,
   default:1,
}



})

const studnt =  database.model('student_work_done_status',work);

module.exports=studnt;