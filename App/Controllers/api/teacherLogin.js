const express = require('express');
const app = express.Router();
const teacherModel =  require(__dirname+'/../../Models/TeacherModel');
const multer = require('multer');
 
app.post('/login', multer().none() , async (req, res) => {
    try {
      const { email, password } = req.body;
      var name = name;
      const user = await teacherModel.findOne({ email: email, password: password });
    if (user) {
        res.status(200).json({ response: user });
    } else {
        res.status(404).json({ response: 'User Details do not exist' , status:true });
    }
    } catch (err) {
      res.status(500).json({ response: 'Internal Server Error' });
    }
 });

 app.get('/get_teacher_details/:teacher_id' ,async(req,res)=>{
     const { teacher_id } = req.params; 
     console.log(teacher_id)
     teacherModel.findOne({ _id: teacher_id }).populate('assign_course').then((data)=>{
      const response =  data.toObject();
     res.status(200).json({ response: response })
     }).catch((err)=>{
     console.log(err.message)
     })
 })

 app.get('/get_teacher_chapter/:teacher_id', multer().none(), async(req,res)=>{
  const { teacher_id } = req.params; 
  console.log(teacher_id)
  teacherModel.findOne({ _id: teacher_id }).populate({path:'assign_course',populate:{path:'chapters'}}).then((data)=>{
   const response =  data.toObject();
  res.status(200).json({ response: response })
  }).catch((err)=>{
  console.log(err.message)
  })
})

app.get('/course_enroll_student/:teacher_id', multer().none(), async(req,res)=>{
  const { teacher_id } = req.params; 
  console.log(teacher_id)
  teacherModel.findOne({ _id: teacher_id }).populate({path:'assign_course',populate:{path:'student'}}).then((data)=>{
   const response =  data.toObject();
  res.status(200).json({ response: response })
  }).catch((err)=>{
  console.log(err.message)
  })
})

module.exports = app;