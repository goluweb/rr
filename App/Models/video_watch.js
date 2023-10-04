const database = require(__dirname+'/../../config/Database');


const data = database.Schema({

user_id:{
    type:database.Schema.Types.ObjectId,
    ref: 'studentModel',
    required: true,
},
chapter_id:{
    type:database.Schema.Types.ObjectId,
    ref: 'chapter',
    required: true,
},
viewed:{
        type:Number,
        default:2
}, 
addedon:{
    type:Date,
    default: new Date(),
    required: true,
}

})

const dataInsert = database.model("video_watch",data);
module.exports=dataInsert;  