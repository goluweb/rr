var database = require(__dirname+'/../../config/Database');


const videos = database.Schema({

    chapter_id:{
        type: database.Schema.Types.ObjectId,
        ref: 'chapter',
        required: true,
    },
    lession_video:{
        type:String,
       
    },
    addedon:{
        type:Date,
        default: new Date(),
        required: true,
    }
});

const videos_chapter = database.model('chapterVideos',videos);
module.exports = videos_chapter