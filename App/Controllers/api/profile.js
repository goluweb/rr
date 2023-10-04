const express = require('express');
const app = express.Router();
const multer = require('multer')
const courses = require(__dirname+'/../../Models/StudentModel')
const imageUpload = require(__dirname+'/../../middleware/uploadImage');
const payment_done = require(__dirname+'/../../Models/payment_done');

app.post('/user_profile',multer().none(),async(req,res)=>{
    const {id} = req.body;
    courses.findOne({_id:id}).then((response)=>{
        console.log(response)
        res.status(200).json({response:response})
    }).catch((err)=>{
        console.log(err.message)
    })
});


app.post('/user_profile_update', imageUpload.single('image'), async (req, res) => {
  try {
    const { id, name, father_name, class1, school_name, mobile, gender, state, email, password, assign_course, address } = req.body;
    const updateData = {
      name,
      email,
      mobile,
      gender,
      image: req.file ? req.file.path : '',
      father_name,  
      class: class1,
      address,
      school_name,
      register: 1,
      state,
    };
    
   await courses.updateOne({ _id: id }, updateData);
    
    res.status(200).json({ status: true, response: 'Profile Successfully Updated!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, response: 'Failed to update profile.' });
  }
});


app.post('/enroll_courses', multer().none(), (req, res) => {
  const { user_id } = req.body;
  payment_done.find({ user_id: user_id }).populate({path: 'playlist_id', populate:{ path: 'chapters'} , populate:{ path: 'teacher'}})
    .then((data) => {
      const response = data.map((doc) => doc.toObject());
      console.log(response);
      res.status(200).json({ response: response });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ error: 'An error occurred while fetching user order.' });
    });
});



module.exports=app;