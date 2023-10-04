var database = require(__dirname+'/../../config/Database');


const data = database.Schema({

    question_id:{
        type:database.Schema.Types.ObjectId,
        ref:'mcq_question',
        required:true,
    },

    answer:{
        type:String,
        
    },
    student_id:{
        type:database.Schema.Types.ObjectId,
        ref:'studentModel',
        required:true,
    },
    added_on:{
        type:Date,
        default: Date('y-m-d h:i:s')
    }

})


const mcq_answer = database.model('mcq_answer',data)

module.exports= mcq_answer