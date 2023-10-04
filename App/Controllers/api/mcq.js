

const express = require('express')
const app = express.Router()
const inqueryModel = require(__dirname+'/../../Models/mcq_playlist');
const questionModel = require(__dirname+'/../../Models/mcq_question');
const answerModel = require(__dirname+'/../../Models/mcq_answer');
const payment_done = require(__dirname+'/../../Models/payment_done');
const mcq_ans = require(__dirname+'/../../Models/mcq_answer');
const multer = require('multer');


app.get('/course/:user_id', multer().none(), (req, res) => {
   const  {user_id } = req.params;
   payment_done.find({user_id: user_id})
      .populate({
         path: 'course_id',
         populate: { path: 'mcq', populate: { path: 'question' } }
      })
      .then((data) => {
         const response = data.map((doc) => doc.toObject());
         console.log(response);
         res.status(200).json({ response });
      })
      .catch((err) => {
         console.log(err);
      });
});


app.get('/level/:id',(req,res)=>{
    const {id} = req.params
    inqueryModel.find({course:id}).populate('course').populate('level').populate('question').then((data)=>{


          const respose = data.map(doc => doc.toObject())
          console.log('you resone'+data);
          res.status(200).json({response:respose})


    }).catch((err)=>{
       console.log(err.message)
    })         
})


app.get('/question/:id',(req,res)=>{
    const {id} = req.params
    questionModel.find({mcq_playlist:id}).populate('mcq_playlist').then((data)=>{
        const respose = data.map(doc => doc.toObject())
        console.log(respose)
        res.status(200).json({response:respose})
    }).catch((err)=>{
       console.log(err.message)
    })
})


app.post('/answer_submit',multer().none(),async(req,res)=>{
      
   const {question_id,answer,student_id}= req.body;
    
   const data = await mcq_ans.findOne({question_id:question_id , student_id:student_id })
   console.log(data)
   if(data===null){
  
      mcq_ans.create({
      question_id:question_id,
      answer:answer, 
      student_id:student_id,  
   }).then((data)=>{
      
      res.status(200).json({response:'Answer submit'})
      console.log(data+'ss')
   }).catch((err)=>{
      console.log(err.message)
      res.status(500).json({response:err.message})
   })

}else{

   mcq_ans.updateOne({ question_id: question_id, student_id: student_id }, { $set: { answer: answer } })
   .then((data) => {
     res.status(200).json({ response: 'Data updated' });
   })
   .catch((err) => {
     console.log(err.message);
     res.status(500).json({ response: err.message });
   });

}
})

app.post('/answer_previos',multer().none(),async(req,res)=>{
      
   const {question_id,student_id}= req.body;

   mcq_ans.findOne({question_id:question_id , student_id:student_id }) .then((data)=>{
      console.log(data)
      res.status(200).json({response:data})
   }).catch((err)=>{
      console.log(err.message)
      res.status(500).json({response:err.message}) 
   })
})


app.get('/result/:user_id/:mcq_playlist/:level', async (req, res) => {
   try {
      const { user_id, mcq_playlist, level } = req.params;
      const total_answer = [];
      const right_answer = [];
      
      const total_question = await inqueryModel
        .findOne({ _id: mcq_playlist, level: level })
        .populate('question'); 

      const total_question_all = total_question.toObject();
  
      for (const data of total_question.question) {
        const response_result = await answerModel.findOne({
          student_id: user_id,
          question_id: data._id,
        });
  
        const response_correct_answer = await answerModel.findOne({
          student_id: user_id,
          answer: data.answer,
          question_id: data._id, 
        });
  
        total_answer.push(response_result);
        right_answer.push(response_correct_answer);
      }
      const filteredAnswers = right_answer.filter(answer => answer !== null);
      const your_result = {
         T_question: total_question_all.question.length,
         T_answer: total_answer.length,
         R_answer: filteredAnswers.length,
       }
       
      console.log(your_result);
  
      res.status(200).json({
        response: {total_question_all, your_result },
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  



  
app.get('/result_all/:user_id', async (req, res) => {
   try {
      const { user_id } = req.params;
      const total_answer = [];
      const right_answer = [];
      const your_result ={};
      
      const total_question = await inqueryModel
        .find()
        .populate('question'); 

        const send_playlist = await inqueryModel.find().populate('course').populate('level'); 

      const total_question_all = total_question.map(doc => doc.toObject())
      const data_send_playlist = send_playlist.map(doc => doc.toObject())
      
   for (const playlist of total_question_all) {
      const total_answer = [];
      const right_answer = [];
      for (const data of playlist.question) {
        const response_result = await answerModel.findOne({
          student_id: user_id,
          question_id: data._id,
        });
  
        const response_correct_answer = await answerModel.findOne({
          student_id: user_id,
          answer: data.answer,
          question_id: data._id, 
        });
  
        total_answer.push(response_result);
            
        right_answer.push(response_correct_answer);
      }
     


      const filteredAnswers = right_answer.filter(answer => answer !== null);
       your_result[playlist._id] = {
          T_question: playlist.question.length,
          T_answer:   total_answer.length,
          R_answer:   filteredAnswers.length,
       } ;
     

      }
     
      res.status(200).json({
        response: {data_send_playlist, your_result },
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


   




module.exports=app;