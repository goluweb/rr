const express = require('express');
const app = express.Router();
const  playList = require(__dirname+'/../../Models/playList')
const courses = require(__dirname+'/../../Models/course')
const mcq = require(__dirname+'/../../Models/mcq_playlist')
const Student_login = require(__dirname+'/../../Models/StudentModel')
const chapter = require(__dirname+'/../../Models/chapter')
const videos_view = require(__dirname+'/../../Models/video_watch')
const multer = require('multer')
  

app.get('/stock_manage_send_course',multer().none(),async(req,res)=>{
  res.header('Access-Control-Allow-Origin', '*');
  playList.find({status:1}).select('_id playlist').sort('-_id').then((data)=>{
    res.status(200).send({response:data} )
  }).catch((err)=>{
    console.log(err); 
    res.status(5000).send(err)
  }) 
})


app.post('/register_manage_send_course',multer().none(),async(req,res)=>{

  const { name, mobile,dob,  center, otp, city , mother_name , email, register, password, assign_course, address, classes, father_name, state, gender, school_name, status } = req.body;
  console.log(req.body);

  await Student_login.create({
    name:name, 
    dob:dob,
    mother_name:mother_name,
    city:city,
    mobile:mobile, 
    email:email,
    register:register,
    password:password,
    assign_course:assign_course,
    address:address,
    class:classes,
    father_name:father_name,
    state:state,
    gender:gender,
    center:center,
    school_name:school_name,
    status:status,


   }).then((data)=>{

    if(typeof data.name != 'undefined' && data.name !== null){
    res.status(200).send({'response':'Data Successfully Insert!'})
    }else{
      res.status(200).send({'response':'data is Null!'})
    }
   }).catch((err)=>{
    console.log('fail')
    res.status(500).send(err)
   })
});



app.get('/update_manage_send_course/:id',multer().none(),async(req,res)=>{
  const { id } = req.params;
  console.log(req.body);
   Student_login.findOne({_id:id}).then((data)=>{
    res.status(200).send({response:data} )
   }).catch((err)=>{
    console.log('fail')
    res.status(500).send(err)
   })
});
 

app.get('/show_all_studnet_list',multer().none(),(req,res)=>{
Student_login.find().then((data)=>{
  res.status(200).send({response:data} )
}).catch((err)=>{
  res.status(200).send({response:err} )
})
})

app.get('/delete_studnet_list/:id',multer().none(),(req,res)=>{
  const {id} = req.params;
  Student_login.deleteOne({_id:id}).then((data)=>{
    console.log('deleted')
    res.status(200).send({response:'successfullly deleted'} )
  }).catch((err)=>{
    res.status(200).send({response:err} )
  })
})

app.post('/updated_manage_send_course',multer().none(),async(req,res)=>{

  const { city , mother_name,center, dob, name, mobile,id, email, register, password, assign_course, address, classes, father_name, state, gender, school_name, status } = req.body;
  console.log(req.body);

  await Student_login.updateOne({
    _id:id
  },{
    name:name, 
    mobile:mobile, 
    dob:dob,
    mother_name:mother_name,
    city:city,
    email:email,
    register:register,
    password:password,
    assign_course:assign_course,
    address:address,
    class:classes,
    father_name:father_name,
    state:state,
    gender:gender,
    center:center,
    school_name:school_name,
    status:status,
   }).then((data)=>{

    if(typeof data.name != 'undefined' && data.name !== null){
      res.status(200).send({'response':'Data Successfully updated!'})
    }else{
      res.status(200).send({'response':'data is Null!'})
    }
   }).catch((err)=>{
    console.log('fail')
    res.status(500).send(err)
   })
});

app.get('/details',multer().none(),async(req,res)=>{
     courses.find({status:1}).populate('teacher')
     .populate({
         path: 'playlist',
         select: 'chapters playlist', 
         options: { limit: 1, status:1 } ,
         populate: {
         path: 'chapters',
         options: { limit: 1 } ,
         select: 'chapterDscription',
       }
     }).sort('-_id')
     .then((data) => {
       console.log(data);
       const plainData = data.map(doc => doc.toObject());
       console.log(plainData)
       res.setHeader('Content-Type', 'application/json');
       res.status(200).send({response:plainData} );
     })
     .catch((err) => {
       console.log(err); 
     });     
})   
 

app.get('/details_random',multer().none(),async(req,res)=>{
  courses.find({status:1}).populate('teacher')
  .populate({
      path: 'playlist',
      select: 'chapters playlist', 
      options: { limit: 1 } ,
      populate: {
      path: 'chapters',
      options: { limit: 1 } ,
      select: 'chapterDscription',
    }
  }).skip(Math.floor(Math.random() * 4)).limit(4)
  .then((data) => {
    console.log(data);
    const plainData = data.map(doc => doc.toObject());
    console.log(plainData)
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({response:plainData});
  })
  .catch((err) => {
    console.log(err);  
  });   
})   


app.get('/details_by_category/:category_id',multer().none(),async(req,res)=>{ 
  const {category_id} = req.params;
  console.log(category_id)
  courses.findOne({_id:category_id}).populate({ path : 'playlist' , populate:{
       path:'chapters',
  }}).then((data)=>{
    console.log(JSON.stringify(data)); 
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({response:data.toObject()});
  }).catch((err)=>{
    console.log(err.message)
    res.status(200).json({response:'Request Fail!'})
  })
})

app.get('/chapter_list/:chapter_id',(req,res)=>{
  const {chapter_id} = req.params;
  console.log(chapter_id)
  playList.find({_id:chapter_id}).populate({ path: 'chapters', populate:{ path: 'videos'} })
  .then((data)=>{
    console.log(data)
    const response = data.map(doc => doc.toObject())
    res.status(200).json({response:response})
  }).catch((err)=>{
    console.log(err.message)
    res.status(500).json({response:'Request Fail'})
  })
}) 


// app.get('/playlist_show/:chapter_id',(req,res)=>{
//   const {chapter_id} = req.params;
//   console.log(chapter_id)
//   courses.findOne({_id:chapter_id}).populate('teacher').populate('payment').populate({path:'playlist' ,populate:{path: 'chapters', populate:{ path: 'videos'} }})
//   .then((data)=>{
//     console.log(data)
//     const response = data.toObject()
//     res.status(200).json({response:response})
//   }).catch((err)=>{
//     console.log(err.message)
//     res.status(500).json({response:'Request Fail'})
//   })
// })


app.get('/playlist_show/:chapter_id',(req,res)=>{
  const {chapter_id} = req.params;
  console.log(chapter_id)
  courses.findOne({_id: chapter_id})
  .populate({
    path: 'playlist',
    populate: [
      { path: 'chapters' },
      { path: 'payments' },
      { path: 'teacher' }
    ] 
   })
  .then((data)=>{
    console.log(data)
    const response = data.toObject()
    res.status(200).json({response:response})
  }).catch((err)=>{
    console.log(err.message)
    res.status(500).json({response:'Request Fail'})
  })
})




app.get('/playlist_filter/:chapter_id/:mode',(req,res)=>{
  const { chapter_id,mode } = req.params;
  console.log(chapter_id);
  courses
    .findOne({ _id: chapter_id })
    .populate({
      path: 'playlist',
      populate: [
        { path: 'chapters' },
        { path: 'payments' },
        { path: 'teacher' }
      ],  
      match: { mode_playlist:mode }
    })
    .then((data) => {
      console.log(data);
      const response = data.toObject();
      res.status(200).json({ response: response });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ response: 'Request Fail' });
    });
  
})


app.get('/playlist_all_chapter/:id',async(req,res)=>{

  const {id} = req.params;
  playList.findOne({_id:id}).populate('chapters').populate('payments').populate('teacher').populate('course_id').populate('level_id').then((data)=>{
    const response = data.toObject()
    console.log(response);
    res.status(200).json({response:response})
  }).catch((err)=>{
    res.status(500).json({response:err})
  }) 

})


app.get('/videos/:id',multer().none(),(req,res)=>{
  const {id} = req.params
  chapter.findOne({_id:id}).populate({path:'videos',options:{limit:1}}).populate('playlist_id').then((data)=>{
    const response = data.toObject()
       res.status(200).json({response:response})
  }).catch((err)=>{
       console.log(err.message)
  })
})

 
app.get('/videos_playlist/:id',multer().none(),async(req,res)=>{
  const {id} = req.params
  const chapte = await chapter.findOne({_id:id})
   playList.findOne({_id:chapte.playlist_id}).populate({path:'chapters',  match: { _id: { $ne:id  } }, populate: {path:'videos'}}).then((data)=>{
     const response = data.toObject()
     res.status(200).json({response:response})
  }).catch((err)=>{
    console.log(err.message)
  })
 })

 app.post('/video_watched',multer().none(),async(req,res)=>{
  try {
    const { user_id, chapter_id, status } = req.body;

    // Ensure the required properties are present in the request data.
    if (!user_id || !chapter_id || !status) {
      return res.status(400).json({ response: false, message: "Missing required parameters." });
    }
 
    // Create the 'videos_view' document.
    await videos_view.create({
      user_id: user_id,
      chapter_id: chapter_id,
      viewed: status,
    });

    // Find the associated chapter and its playlist.
    const data1 = await chapter.findOne({ _id: chapter_id }).populate('playlist');

    if (!data1 || !data1.playlist || data1.playlist.length === 0) {
      return res.status(404).json({ response: false, message: "Chapter or playlist not found." });
    }

    const courseId = data1.playlist[0].course_id;
    const levelId = data1.playlist[0].level_id;
    console.log(courseId,levelId)

    const send_mcq = await mcq
      .findOne({ course: courseId, level: levelId });

    if (!send_mcq) {
      return res.status(404).json({ response: false, message: "MCQ not found." });
    }

    console.log(send_mcq);
    res.status(200).json({ response: true, data1: send_mcq });
  } catch (err) {
    console.error("Error while processing video watched:", err);
    res.status(500).json({ response: false, message: "Internal server error." });
  }
 })


app.post('/video_watched_status',multer().none(),(req,res)=>{
  const {user_id, chapter_id} = req.body;
  videos_view.findOne({user_id:user_id, chapter_id:chapter_id}).then((data)=>{
   res.status(200).json({response:true})
  }).catch((err)=>{
   console.log(err.message)
  })
})

module.exports = app;   