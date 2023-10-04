const express = require('express')
const app = express.Router()
const courseModel = require(__dirname+'/../../Models/course');
const level = require(__dirname+'/../../Models/level');
const mcq_playlist = require(__dirname+'/../../Models/mcq_playlist');

const question_model = require(__dirname+'/../../Models/mcq_question');
const inArray = require('in-array'); 


app.get('/add',async(req,res)=>{
   const course = await courseModel.find();
   const levelData = await level.find()
   res.render('admin/mcq/add',{inArray:inArray,course:course,level:levelData})
})

app.post('/add', async(req, res) => {
    try {
   
      const { title, course_id, level_id } = req.body;
      const { question, option_a, option_b, option_c, option_d, answer } = req.body;
      
      const playlist = await mcq_playlist.create({
        title: title,
        course: course_id,
        level: level_id
      });
   
      for (let i = 0; i < question.length; i++) {
        await question_model.create({
          mcq_playlist: playlist._id,
          question: question[i],
          option_a: option_a[i],
          option_b: option_b[i],
          option_c: option_c[i],
          option_d: option_d[i],
          answer: answer[i]
        });
      }
  
      res.redirect('/mcq/show');
    } catch (error) {
      console.log(error.message)
    }
  });
  
app.get('/show',async(req,res)=>{

     mcq_playlist.find().populate('course').populate('level').populate('question').then((data)=>{
   
      res.render('admin/mcq/show',{data:data,inArray:inArray})
    }).catch((err)=>{
        console.log(err.message)
    })
})

app.get('/delete/:id',(req,res)=>{
  const {id}=req.params
  mcq_playlist.deleteOne({_id:id}).then((data)=>{
     res.redirect('/mcq/show')
  }).catch((err)=>{
    console.log(err.message)
  })
})


app.get('/edit/:id',async(req,res)=>{
     const {id} = req.params
     const course = await courseModel.find();
     const levelData = await level.find()
     const playlist = await  mcq_playlist.findOne({_id:id}).populate('course').populate('level').populate('question')
     console.log(playlist)
     res.render('admin/mcq/edit',{course:course,levelData:levelData,playlist:playlist,inArray:inArray})
})

app.get('/delete_question/:id', async (req, res) => {
  const { id } = req.params; // Access the 'id' parameter from the query string
        console.log('delete_id'+id)
  try {
    const delet = await question_model.deleteOne({ _id: id });
    console.log('cccccc'+delet)
    res.json({ 'data': 'successfully deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ 'error': 'Failed to delete question' });
  }
});


app.post('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("sddddddddddddddddd"+id)
    const { title, course_id, level_id } = req.body;
    const { question, option_a, option_b, option_c, option_d, answer,ques } = req.body;

    const playlist = await mcq_playlist.updateOne({ _id: id }, {
      title: title,
      course: course_id,
      level: level_id
    });

    for (let i = 0; i < question.length; i++) {
      await question_model.findOneAndUpdate(
        { mcq_playlist: id, question: ques[i] },
        {
          mcq_playlist: id,
          question: question[i],
          option_a: option_a[i],
          option_b: option_b[i],
          option_c: option_c[i],
          option_d: option_d[i],
          answer: answer[i]
        },
        { upsert: true }
      );
    }

    res.redirect('/mcq/show');
  } catch (error) {
    console.log(error.message);
  }
});

module.exports=app