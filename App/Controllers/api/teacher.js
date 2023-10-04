const { json } = require('body-parser');
const express = require('express');
const app = express.Router();
const teacherModel =  require(__dirname+'/../../Models/TeacherModel');
const multer = require('multer');

app.get('/show',multer().none(),(req,res)=>{
    teacherModel.find({status:1}).sort('-_id').populate('assign_course','_id playlist').then((data)=>{
        const respose = data.map(doc => doc.toObject())
        res.status(200).json({response:respose})
    }).catch((err)=>{
         console.log(err.message)
    })
});

app.get('/show_teacher/:_id', (req, res) => {
    const { _id } = req.params;
  
    teacherModel
      .findOne({ _id: _id ,status:1}) 
      .populate({path:'assign_course', match: { status: 1 } , populate:{path:'payments'}})
      .then((data) => {
        const response =  data.toObject();
        console.log(response)
        res.status(200).json({ response:response });
      })
      .catch((err) => {
        console.log(err.message); 
        res.status(500).json({ error: err.message });
    });
});
  
module.exports = app; 