const database = require(__dirname + '/../../config/Database');

const AssignmentAssignSchema = new database.Schema({
 
    question_id:{
        type:database.Schema.Types.ObjectId,
        ref:'assignment_question',
        required:[true,'Question is required']
    },

    student_id:{
        type:database.Schema.Types.ObjectId,
        ref:'studentModel',
        required:[true,'Student is required']
    },

    answer:{
        type:String,
        required:[true,'Answer is required']
    },

    marks:{
        type:Number,
    },

    negetive:{
        type:Number,
    },

    added_on:{
        type:Date,
        default: Date.now()
    }


})

const ansTable = database.model('assignment_answer',AssignmentAssignSchema)

module.exports = ansTable