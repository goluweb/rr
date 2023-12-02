const database = require(__dirname+'/../../config/Database');

const assign = database.Schema({

    name:{
        type:String,
        required:[true,'Name field is required']
    },

    chapter_id:{
        type:database.SchemaTypes.ObjectId,
        ref:'chapter',
        required:[true,'chapter id is required!']
    },

    type:{
       type:String,
       required:[true,'type is required']
    },

   added_on:{
    type:Date,
    default: Date.now()
   }
})

assign.virtual('get_question',{
    ref: 'assignment_question',
    localField: '_id',
    foreignField:'assignment_id',
    justOne: false,
});

assign.virtual('get_assignment_status',{
    ref: 'student_work_done_status',
    localField: '_id',
    foreignField:'assignment_done',
    justOne: false,
});

assign.set('toObject', { virtuals: true });

const   assignModel  =  database.model('assignment',assign);

module.exports = assignModel;