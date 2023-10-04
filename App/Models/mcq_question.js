var database = require(__dirname+'/../../config/Database');

const mcq = database.Schema({

    question:{
       type:String
     
    },
    option_a:{
       type:String,

    },
    option_b:{
        type:String,
 
     },
     option_c:{
        type:String,
 
     },
     option_d:{
        type:String,
 
     },
     answer:{
        type:String,
 
     },
    mcq_playlist:{
        type:database.Schema.Types.ObjectId,
        ref:'mcq_playlist',
        required:false,
    },
    added_on:{
        type:Date,
        default: new Date()
    }
})


const mcq_question = database.model('mcq_question',mcq)

module.exports=mcq_question