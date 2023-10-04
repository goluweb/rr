var database = require(__dirname+'/../../config/Database');


const course = new database.Schema({

    courseName:{
        type:String,
        require:true,
    },

    courseImage:{
        type:String,
        require:true,
    },

    desc:{
        type:String,

    },

    status:{
        type:Number,
        default:2,
    },

    date:{
        type:Date,
        default: new Date(),

    }

});


course.virtual('playlist',{
    ref: 'playList',
    localField: '_id',
    foreignField:'course_id',
    justOne: false,
});

course.virtual('mcq',{
    ref: 'mcq_playlist',
    localField: '_id',
    foreignField:'course_id',
    justOne: false,
});



course.virtual('teacher',{
    ref: 'teacherModel',
    localField: '_id',
    foreignField:'assign_course',
    justOne: false,
});

course.set('toObject', { virtuals: true });

const courseObj = database.model('course_name',course);

module.exports=courseObj;