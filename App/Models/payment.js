var database = require(__dirname+'/../../config/Database');


const fee = database.Schema({

    playlist_id:{
        type:database.Schema.Types.ObjectId,
        ref:'playList',
        required:false,
    },

    fee:{
        type:Number,

    },
    discount:{
        type:String
    },

    addedOn:{
        type:Date,
        default: new Date(),
    }

})

const table_payment = database.model('payments',fee);

module.exports=table_payment;