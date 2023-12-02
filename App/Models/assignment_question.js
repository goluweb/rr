const database = require(__dirname+'/../../config/Database');

const question = database.Schema({
  
  assignment_id:{
       type:database.SchemaTypes.ObjectId,
       ref: 'assignment',
       required:[true,'assignment field is required']
    },
   
    answer:{
        type:String,
    },

    second_answer:{
       type:String
    },

    marks:{
      type:Number,
    },

    negative:{
        type:Number,
    },

   position:{
    type:String,
    required:[true,'position field is required']
    },

    question:{
      type:String
    }


});

question.virtual('get_answer',{
  ref: 'assignment_answer',
  localField:'_id',
  foreignField:'question_id',
  justOne: false,
});

question.set('toObject', { virtuals: true });

const   assignModel  =  database.model('assignment_question',question);

module.exports = assignModel;