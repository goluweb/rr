var database = require(__dirname+'/../../config/Database');

const playList1 = database.Schema({

    user_id:{
        type:database.Schema.Types.ObjectId,
        ref:'admin_logins',
        required:true,
    },

    course_id:{
        type:database.Schema.Types.ObjectId,
        ref:'course_name',
        required: true,
    },
    level_id:{
        type:database.Schema.Types.ObjectId,
        ref:'level_name',
        required:true,
    },
    playlist:{
        type:String,
        
    },
    thumbnail:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        
    },
    status:{
        type:Number,
        default:2,
        required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    mode_playlist:{
        type:String,
        
    },
    endDate:{
        type:Date,
        required:true,
    },
    added_on:{
        type:Date,
        default: new Date(),
        required : true,
    },

});

playList1.virtual('chapters', {
    ref: 'chapter',
    localField: '_id',
    foreignField: 'playlist_id',
    justOne: false,
  });

  playList1.virtual('payments',{
    ref: 'payments',
    localField: '_id',
    foreignField:'playlist_id',
    justOne: false,
});


playList1.virtual('teacher',{
    ref: 'teacherModel',
    localField: '_id',
    foreignField:'assign_course',
    justOne: false,
});

playList1.virtual('student',{
    ref: 'studentModel',
    localField: '_id',
    foreignField: 'assign_course',
    justOne: false,
})

  playList1.set('toObject', { virtuals: true });

const playList = database.model('playList',playList1);


module.exports = playList;