var database = require(__dirname+'/../../config/Database');

const mcq = database.Schema({

    title:{
       type:String
    },
    course:{
        type:database.Schema.Types.ObjectId,
        ref:'course_name',
        required:false,
    },
    level:{
        type:database.Schema.Types.ObjectId,
        ref:'level_name',
        required:false,
    },
    added_on:{
        type:Date,
        default: new Date()
    }
})


mcq.virtual('question',{
    ref: 'mcq_question',
    localField: '_id',
    foreignField:'mcq_playlist',
    justOne: false,
});

mcq.set('toObject', { virtuals: true });

const mcq_play = database.model('mcq_playlist',mcq)

module.exports=mcq_play