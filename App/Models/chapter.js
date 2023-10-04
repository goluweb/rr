var database = require(__dirname+'/../../config/Database');

const chapter1= database.Schema({

    playlist_id:{
        type: database.Schema.Types.ObjectId,
        ref: 'playList',
        required: true,
    },

    chapter_name:{
        type:String,
        required:true,
    },
    chapterDscription:{
        type:String,
        required: true,
    },

    notes:{
        type:String,
      
    },
    mode:{
        type:String,
        required:true,
    },

    lessionThumbnail:{
        type:String,

    },

    url:{
        type:String,
    },
    lesstionStartDate:{
        type:Date,
        required:true,
    },
    lessionEndDate:{
        type:Date,
        required:true
    },
    play_List_discription:{
        type:String
    },
    addedon:{
        type:Date,
        default: new Date(),
        required:true
    }

});

chapter1.virtual('videos',{
    ref: 'chapterVideos',
    localField: '_id',
    foreignField:'chapter_id',
    justOne: false,
});
chapter1.virtual('playlist',{
    ref: 'playList',
    localField: 'playlist_id',
    foreignField:'_id',
    justOne: false,
});

chapter1.set('toObject', { virtuals: true });

const chapter = database.model('chapter',chapter1);

module.exports = chapter;