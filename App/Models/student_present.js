const database = require(__dirname + '/../../config/Database');


const student_present = new database.Schema({


student_id:{
    type:database.Schema.Types.ObjectId,
    ref:'studentModel',
    required:[true,'Student is required']
},

chapter_id:{
    type:database.Schema.Types.ObjectId,
    ref:'chapter' ,
    required:[true,'Chapter is required']
}




})

const studnt =  database.model('student_present',student_present);

module.exports=studnt;