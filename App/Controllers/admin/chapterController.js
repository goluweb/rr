const express = require('express');
const app = express.Router();
const loginModel = require(__dirname+'/../../Models/admin_login');
const courseModel = require(__dirname+'/../../Models/course');
const levelModel = require(__dirname+'/../../Models/level');
const videosModel = require(__dirname+'/../../Models/videos_chapter');
const chapterModel = require(__dirname+'/../../Models/chapter');
const playListModel = require(__dirname+'/../../Models/playList');
const rolePermission = require(__dirname+'/../../middleware/PermissionCheck'); //middleware for session check

const imageUpload = require(__dirname+'/../../middleware/uploadImage');
const { populate } = require(__dirname+'/../../Models/admin_login');
const inArray = require('in-array'); 

app.get('/addchapter',rolePermission('addChapter'), async (req,res)=>{
  
   const course = await courseModel.find({status:1});
   const lavel = await levelModel.find();

   res.render('admin/chapter/add_chapter',{course:course,lavel:lavel,inArray:inArray});
})


app.post('/addchapter',rolePermission('addChapter'),imageUpload.any(), async (req, res) => {

      const { course_id ,level_id ,desc, playlist ,startDate,endDate ,play_List_discription, mode_playlist} = req.body;
      const { chapter_name, chapterDscription, mode, lesstionStartDate,lessionEndDate ,url } = req.body;

      var thambnail;
    
   for(var i=0; i < req.files.length; i++){
      if(req.files[i].fieldname == 'thumbnail'){
         thambnail = req.files[i].path;
      } 
   }

   const files_array = req.files;
   console.log(req.files)
   const note = files_array.filter(obj => obj.fieldname === 'notes[]');
   const thumb = files_array.filter(obj => obj.fieldname === 'lessionThumbnail[]');
   const videos = files_array.filter(obj => obj.fieldname === 'lession_video[]')
   console.log(videos)
  
   const play = await playListModel({
      user_id:req.session.user._id,
      course_id:course_id,
      level_id:level_id,
      play_List_discription:play_List_discription,
      playlist:playlist,
      desc:desc,
      thumbnail:thambnail,
      mode_playlist:mode_playlist,
      startDate:startDate,
      endDate:endDate
   }).save();
  


   for (let i = 0; i < chapter_name.length; i++) {
      const chapterData = {
         playlist_id: play._id,
         chapter_name: chapter_name[i],
         chapterDscription: chapterDscription[i],
         mode: mode[i],
         url: url[i],
         lesstionStartDate: lesstionStartDate[i],
         lessionEndDate: lessionEndDate[i],
      };
   
      if (thumb[i]) {
         // If a thumbnail image is provided, insert it
         chapterData.lessionThumbnail = thumb[i].path;
      }
   
      const chapter_insert = await chapterModel(chapterData).save();

      if(mode[i] === 'upload'){
      await videosModel({
         chapter_id:chapter_insert._id,
         lession_video: typeof videos[i] !== 'undefined' &&  videos[i] !== null ? videos[i].path : '',
      }).save();
   }
}
res.redirect('/chapter/show_chapter');
})     

app.get('/show_chapter',rolePermission('viewChapter'), async(req,res) =>{
   var playlist;
    if(req.session.user.roles_id.roles === 'admin'){
      playlist = await playListModel.find().sort('-_id').populate('user_id').populate('course_id').populate('level_id').populate({ path:'chapters',populate: {path: 'videos'}}).exec();
    }else{
       playlist = await playListModel.find({user_id: req.session.user._id}).sort('-_id').populate('user_id').populate('course_id').populate('level_id').populate({ path:'chapters',populate: {path: 'videos'}}).exec();
     }
   res.render('admin/chapter/show_chapter',{playlist:playlist,inArray:inArray}); 
})


app.get('/delete_chapter/:id',rolePermission('deleteChapter'),async (req,res)=>{
   
   const {id} = req.params;
   const data = await playListModel.deleteOne({_id:id});
   res.redirect('/chapter/show_chapter');
})

app.get('/status_chapter/:id/:status',rolePermission('statusChapter'),async (req,res)=>{
   const id = req.params.id;
   const status = req.params.status;
   await playListModel.updateOne({_id:id},{status:status});
   res.redirect('/chapter/show_chapter');
})


app.get('/show_videos_list/:id',async(req,res)=>{
  const {id} = req.params;
  const chapter = await chapterModel.find({playlist_id:id}).populate('videos')
  res.render('admin/chapter/show_chapter_videos',{chapter_videos:chapter,path_:id,inArray:inArray})
})

app.get('/delete_videos_chapter/:id/:path', async(req,res)=>{
   const {id,path} = req.params;
   await chapterModel.deleteOne({_id:id})
      const data = await videosModel.findOne({chapter_id:id})
   if(data){
      await videosModel.deleteOne({chapter_id:id})
   }
      res.redirect('/chapter/show_videos_list/'+path);
}),

app.get('/edit_chapter/:id',rolePermission('editChapter'),async (req,res)=>{
   const {id} = req.params;
   const course = await courseModel.find();
   const lavel = await levelModel.find();
   const playlist = await playListModel.findOne({_id:id}).populate('user_id').populate('course_id').populate('level_id').populate({ path:'chapters',populate: {path: 'videos'}}).exec();
   console.log(playlist)
   res.render('admin/chapter/edit_chapter',{playlist:playlist,course:course,lavel:lavel,inArray:inArray})
})



////////////////////////////////////////////////////////////////////////////////////////////////


app.post('/editchapter/:id',rolePermission('editChapter'), async(req,res)=>{
    const id = req.params.id;
    const { course_id ,level_id , playlist, desc ,startDate,endDate,chapter_id,mode_playlist } = req.body;
    const { chapter_name, chapterDscription, mode, lesstionStartDate,lessionEndDate ,url } = req.body;
    var thambnail;
  
 for(var i=0; i < req.files.length; i++){
    if(req.files[i].fieldname == 'thumbnail'){
       thambnail = req.files[i].path;
    } 
 }

 const files_array = req.files;
 const note = files_array.filter(obj => obj.fieldname === 'notes[]');
 const thumb = files_array.filter(obj => obj.fieldname === 'lessionThumbnail[]');
 const videos = files_array.filter(obj => obj.fieldname === 'lession_video[]')
 

 const play = await playListModel.updateOne({_id:id},{
    course_id:course_id,
    level_id:level_id,
    playlist:playlist,
    thumbnail:thambnail == null ? '' : thambnail ,
    startDate:startDate,
    mode_playlist:mode_playlist,
    endDate:endDate
 });
 for (let i=0; i < chapter_name.length; i++){
 if(chapter_id[i]){ 
 const chapter_insert = await chapterModel({ _id:chapter_id[i] },{
       playlist_id:play._id,
       chapter_name:chapter_name[i],
       chapterDscription:chapterDscription[i],
       notes:note[i]== null ? '' : note[i].path ,
       mode:mode[i],
       url:url[i],
       lessionThumbnail: thumb[i] == null ? '' : thumb[i].path,
       lesstionStartDate:lesstionStartDate[i],
       lessionEndDate:lessionEndDate[i]
    })


    if(mode[i] === 'upload'){
      await videosModel({
         chapter_id:chapter_insert._id,
         lession_video: typeof videos[i] !== 'undefined' &&  videos[i] !== null ? videos[i].path : '',
      }).save();
    }
   

   }

 
}

})

module.exports=app;

