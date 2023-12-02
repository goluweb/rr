const { populate } = require('dotenv');
const express = require('express');
const app = express.Router();
const teacherModel =  require(__dirname+'./../../Models/TeacherModel');
const playModel =  require(__dirname+'./../../Models/playList');
const chapter_view =  require(__dirname+'./../../Models/chapter');
const assignmentModel = require(__dirname+'/../../Models/assignment');
const assign_question_Model = require(__dirname+'/../../Models/assignment_question');
const assign_task = require(__dirname+'/../../Models/assignment_assign');
const assign_answer = require(__dirname+'/../../Models/assignment_answer');
const student_present = require(__dirname+'/../../Models/student_present');
const student = require(__dirname+'/../../Models/StudentModel');

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

 app.get('/get_teacher_chapter/:id', multer().none(), async(req,res)=>{
  const { id } = req.params; 
  console.log(id)
  playModel.findOne({ _id: id }).populate('chapters').then((data)=>{
   const response =  data.toObject();
  res.status(200).json({ response: response })
  }).catch((err)=>{
  console.log(err.message)
  })
})

app.get('/course_enroll_student/:teacher_id', multer().none(), async(req,res)=>{
  const { teacher_id } = req.params; 
  teacherModel.findOne({ _id: teacher_id }).populate({path:'assign_course' ,populate:{path:'student'}}).then((data)=>{
   const response =  data.toObject();
   console.log(response)
  res.status(200).json({ response: response })
  }).catch((err)=>{
  console.log(err.message)
  })
})

app.get('/get_chapter_details/:chapter_id', multer().none(), async(req,res)=>{
  const { chapter_id, } = req.params; 
  
  const student1 = await student_present.find({chapter_id:chapter_id});
  const studentIds = student1.map(record => record.student_id);
  chapter_view.findOne({ _id: chapter_id }).populate({path:'playlist' ,populate:{path:'student',  match: { _id: { $in: studentIds } }    }}).then((data)=>{
   const response =  data.toObject();
   console.log('chapte'+response)
  res.status(200).json({ response: response })
  }).catch((err)=>{
  console.log(err.message)
  }) 
  
})

app.get('/view_absence/:chapter_id', multer().none(), async (req, res) => {
  try {
    const { chapter_id } = req.params;

    // Extract Chapter Information
    const chapter = await chapter_view.findOne({ _id: chapter_id });

    // Find Present Students for the Chapter
    const student1 = await student_present.find({ chapter_id: chapter_id });
    const studentIds = student1.map(record => record.student_id);

    // Find Absent Students for the Chapter
    const data = await student.find({ _id: { $nin: studentIds }, assign_course: chapter.playlist_id });

    // Logging and Sending the Response
    const chapterResponse = chapter ? chapter.toObject() : null;
    const absentStudentsResponse = data.map(doc => doc.toObject());

    console.log('Chapter:', chapterResponse);
    console.log('Absent Students:', absentStudentsResponse);

    res.status(200).json({
      response: absentStudentsResponse
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/view_all_assignment/:student_id/:chapter_id',multer().none(), (req,res)=>{
   const { student_id, chapter_id } = req.params;
   assign_task.find({ student_id : student_id, chapter_id:chapter_id }).populate('assignment_id').then((data)=>{
   console.log(data);
   const response = data.map((doc) => doc.toObject());
    res.status(200).send({response : response})
 }).catch((err)=>{
    res.send(err)
 }) 
})

app.get('/view_all_assignment_allquestion/:assign_id',multer().none(), (req,res)=>{
  const { assign_id } = req.params;
  assignmentModel.findOne({ _id: assign_id  }).populate({path:'get_question', populate:{path:'get_answer'}}).then((data)=>{
  console.log(data);
  const response = data.toObject();
   res.status(200).send({response : response})
}).catch((err)=>{
   res.send(err)
}) 
})

// app.get('/get_assignment_question_answer/:assignment_id/:student_id',multer().none(),(req,res)=>{
//   const { assignment_id , student_id} = req.params;
//   assign_question_Model.find({assignment_id:assignment_id}).populate({  path: 'get_answer',
//   match: { student_id: student_id }}).then((data)=>{
//       console.log(data);
//       const response = data.map((doc) => doc.toObject());
//       res.status(200).send({response : response})
//    }).catch((err)=>{
//       res.send(err)
//    }) 
// })

app.get('/get_all_student/:chapter_id',multer().none(),(req,res)=>{

  const {chapter_id} = req.params;

  student.find({ assign_course : chapter_id }).then((data)=>{
          console.log(data);
          const response = data.map((doc) => doc.toObject());
          res.status(200).send({response : response})
       }).catch((err)=>{
          res.send(err)
       }) 
})


// app.get('/get_class_work_status_report/:student_id/:chapter_id', multer().none(), async (req, res) => {
//   try {
//     const { student_id, chapter_id } = req.params;
//     const data = await student.findOne({ _id: student_id })
//       .populate({
//         path: 'assign_course',
//         match: { _id: chapter_id },
//         populate: {
//           path: 'chapters',
//           populate: {
//             path: 'assignment',
//             match: { type: 'class_work' },
//             populate: [
//               { path: 'get_question', populate: { path: 'get_answer' } },
//               { path: 'get_assignment_status' }
//             ]
//           }
//         }
//       });

//     const response = data.toObject();
//     console.log(response);
//     res.status(200).send({ response });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// });



// app.get('/get_home_work_status_report/:student_id/:chapter_id', multer().none(), async (req, res) => {
//   try {
//     const { student_id, chapter_id } = req.params;
//     const data = await student.findOne({ _id: student_id })
//       .populate({
//         path: 'assign_course',
//         match: { _id: chapter_id },
//         populate: {
//           path: 'chapters',
//           populate: {
//             path: 'assignment',
//             match: { type: 'home_work' },
//             populate: [
//               { path: 'get_question', populate: { path: 'get_answer' } },
//               { path: 'get_assignment_status' }
//             ]
//           }
//         }
//       });
//     const response = data.toObject();
//     console.log(response);
//     res.status(200).send({ response });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// });

app.get('/get_playlist/:student_id', multer().none(), async (req, res) => {
   const { student_id } = req.params;  
   student.findOne({ _id: student_id }).populate('assign_course').then((data)=>{
    console.log(data);
    const response = data.toObject();
    res.status(200).send({response : response})
  }).catch((err)=>{
    res.send(err)
  }) 
  })

  app.get('/get_chapter/:playlist_id', multer().none(), async (req, res) => {
     const { playlist_id } = req.params;     
     chapter_view.find({ playlist_id: playlist_id }).then((data)=>{
     console.log(data);
     const response = data;
     res.status(200).send({response : response})
   }).catch((err)=>{
     res.send(err)
   }) 
   })
   app.get('/get_all_report/:student_id/:chapter_id?/:type?',multer().none(),async(req,res)=>{
    const { student_id,chapter_id,type } = req.params;
    let data=''
    let response=''
    if(student_id !=null && chapter_id !=null && type != null){
    const data3424 = await chapter_view.findOne({ _id: chapter_id })
    .populate({
      path:'get_assignment_assign',
      match:{student_id:student_id},
      populate:{
        path:'assignment_id',
        match:{type:type},
        populate: [
          { path: 'get_question', populate: { path: 'get_answer' } },
          { path: 'get_assignment_status' }
         ]
      }
    })
     response = data3424.toObject();
  }else if(student_id != null && chapter_id == null && type == null){

    const ee = await chapter_view.find()
    .populate({
      path:'get_assignment_assign',
      match:{student_id:student_id},
      populate:{
        path:'assignment_id',
 
        populate: [
          { path: 'get_question', populate: { path: 'get_answer' } },
          { path: 'get_assignment_status' }
         ]
      }
    })
    response = ee.map(doc => doc.toObject());
  }else if(student_id != null && chapter_id != null && type == null){

  const   data23 = await chapter_view.findOne({ _id: chapter_id })
    .populate({
      path:'get_assignment_assign',
      match:{student_id:student_id},
      populate:{
        path:'assignment_id',
 
        populate: [
          { path: 'get_question', populate: { path: 'get_answer' } },
          { path: 'get_assignment_status' }
         ]
      }
    })
     response = data23.toObject();
  }
      
      console.log(response);
      res.status(200).send({response : response})
   })
   module.exports = app;