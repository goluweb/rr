const express = require('express');
const app = express.Router();
const multer = require('multer');
const upload = multer();
const rolesModel = require(__dirname+'/../../Models/roles');
const rolePermission = require(__dirname+'/../../middleware/PermissionCheck'); //middleware for session check
const inArray = require('in-array'); 



app.get('/dashboard',async (req,res)=>{ 
     console.log(res.locals.attendance)
    res.render('admin/dashboard/dashboard',{inArray:inArray});
});

app.get('/add_roles',rolePermission('addRole'),(req,res)=>{ 
    res.render('admin/roles/add_roles',{inArray:inArray});
});

app.post('/add_roles',rolePermission('addRole'),upload.any(), async(req,res)=>{ 
    const { role_name,viewRole,addRole,editRole,deleteRole,viewUser,addUser,editUser,deleteUser,statusUser,viewCourse,addCourse,editCourse,statusCourse,deleteCourse,viewLevel,addLevel,editLevel,statusLevel,deleteLevel,viewChapter,addChapter,editChapter,statusChapter,deleteChapter,viewTeacher,addTeacher,editTeacher,statusTeacher,deleteTeacher,viewStudent,addStudent,editStudent,statusStudent,deleteStudent,viewContact,mailContact,deleteContact,viewTask,addTask,editTask,deleteTask,viewTodo,addTodo,deleteTodo,filterTodo,viewAtten,addAtten,deleteAtten} = req.body;

     const ss = new rolesModel({
        roles:role_name,
      permission: [
            (viewRole == 'on' ? 'viewRole':''),
            (addRole == 'on' ? 'addRole':''),
            (editRole == 'on' ? 'editRole':''),
            (deleteRole == 'on' ? 'deleteRole':''),
           
            (viewTask == 'on' ? 'viewTask':''),
            (addTask == 'on' ? 'addTask':''),
            (editTask == 'on' ? 'editTask':''),
            (deleteTask == 'on' ? 'deleteTask':''),

            (viewTodo == 'on' ? 'viewTodo':''),
            (addTodo == 'on' ? 'addTodo':''),
            (deleteTodo == 'on' ? 'deleteTodo':''),
            (filterTodo == 'on' ? 'filterTodo':''),

            (viewAtten == 'on' ? 'viewAtten':''),
            (addAtten == 'on' ? 'addAtten':''),
            (deleteAtten == 'on' ? 'deleteAtten':''),


            (viewUser == 'on' ? 'viewUser':''),
            (addUser == 'on' ? 'addUser':''),
            (editUser == 'on' ? 'editUser':''),
            (statusUser == 'on' ? 'statusUser':''),
            (deleteUser == 'on' ? 'deleteUser':''),


            (viewCourse == 'on' ? 'viewCourse':''),
            (addCourse == 'on' ? 'addCourse':''),
            (editCourse == 'on' ? 'editCourse':''),
            (statusCourse == 'on' ? 'statusCourse':''),
            (deleteCourse == 'on' ? 'deleteCourse':''),

            (viewLevel == 'on' ? 'viewLevel':''),
            (addLevel == 'on' ? 'addLevel':''),
            (editLevel == 'on' ? 'editLevel':''),
            (statusLevel == 'on' ? 'statusLevel':''),
            (deleteLevel == 'on' ? 'deleteLevel':''),


            (viewChapter == 'on' ? 'viewChapter':''),
            (addChapter == 'on' ? 'addChapter':''),
            (editChapter == 'on' ? 'editChapter':''),
            (statusChapter == 'on' ? 'statusChapter':''),
            (deleteChapter == 'on' ? 'deleteChapter':''),

            (viewTeacher == 'on' ? 'viewTeacher':''),
            (addTeacher == 'on' ? 'addTeacher':''),
            (editTeacher == 'on' ? 'editTeacher':''),
            (statusTeacher == 'on' ? 'statusTeacher':''),
            (deleteTeacher == 'on' ? 'deleteTeacher':''),

          
            (viewStudent == 'on' ? 'viewStudent':''),
            (addStudent == 'on' ? 'addStudent':''),
            (editStudent == 'on' ? 'editStudent':''),
            (statusStudent == 'on' ? 'statusStudent':''),
            (deleteStudent == 'on' ? 'deleteStudent':''),
            
            (viewContact == 'on' ? 'viewContact':''),
            (mailContact== 'on' ? 'mailContact':''),
            (deleteContact == 'on' ? 'deleteContact':''),
        ],

    });
     ss.save().then((user) => {
        console.log(`created successfully`);
        res.redirect('/dashboard/show_roles');
      })
      .catch((error) => {
        console.error('Error creating user:', error);
       
      });

});

app.get('/show_roles',rolePermission('viewRole'),async (req,res)=>{ 
    const allRoles = await rolesModel.find().sort('_id');
    res.render('admin/roles/show_roles',{allRoles:allRoles,inArray:inArray});
});

app.get('/delete_roles/:id',rolePermission('deleteRole'),async (req,res)=>{ 
    const userId = req.params.id;
    const allRoles = await rolesModel.deleteOne({_id:userId});
    res.redirect('/dashboard/show_roles');
});

app.get('/edit_roles/:id',rolePermission('editRole'),async (req,res)=>{ 
    const userId = req.params.id;
    const allRoles = await rolesModel.findOne({_id:userId});
    console.log(allRoles);
    res.render('admin/roles/edit_roles',{roleData:allRoles,inArray:inArray});
});

app.post('/edited_roles/:id',rolePermission('editRole'),upload.any(),async (req,res)=>{ 
    const userId = req.params.id;
    const { role_name,viewRole,addRole,editRole,deleteRole,viewUser,addUser,editUser,deleteUser,statusUser,viewCourse,addCourse,editCourse,statusCourse,deleteCourse,viewLevel,addLevel,editLevel,statusLevel,deleteLevel,viewChapter,addChapter,editChapter,statusChapter,deleteChapter,viewTeacher,addTeacher,editTeacher,statusTeacher,deleteTeacher,viewStudent,addStudent,editStudent,statusStudent,deleteStudent,viewContact,mailContact,deleteContact,viewTask,addTask,editTask,deleteTask,viewTodo,addTodo,deleteTodo,filterTodo,viewAtten,addAtten,deleteAtten} = req.body;

     rolesModel.updateOne({_id:userId},{
        roles:role_name,
        permission: [
            (viewRole == 'on' ? 'viewRole':''),
            (addRole == 'on' ? 'addRole':''),
            (editRole == 'on' ? 'editRole':''),
            (deleteRole == 'on' ? 'deleteRole':''),

            (viewUser == 'on' ? 'viewUser':''),
            (addUser == 'on' ? 'addUser':''),
            (editUser == 'on' ? 'editUser':''),
            (statusUser == 'on' ? 'statusUser':''),
            (deleteUser == 'on' ? 'deleteUser':''),

            (viewTask == 'on' ? 'viewTask':''),
            (addTask == 'on' ? 'addTask':''),
            (editTask == 'on' ? 'editTask':''),
            (deleteTask == 'on' ? 'deleteTask':''),

            (viewTodo == 'on' ? 'viewTodo':''),
            (addTodo == 'on' ? 'addTodo':''),
            (deleteTodo == 'on' ? 'deleteTodo':''),
            (filterTodo == 'on' ? 'filterTodo':''),

            (viewAtten == 'on' ? 'viewAtten':''),
            (addAtten == 'on' ? 'addAtten':''),
            (deleteAtten == 'on' ? 'deleteAtten':''),

            (viewCourse == 'on' ? 'viewCourse':''),
            (addCourse == 'on' ? 'addCourse':''),
            (editCourse == 'on' ? 'editCourse':''),
            (statusCourse == 'on' ? 'statusCourse':''),
            (deleteCourse == 'on' ? 'deleteCourse':''),

            (viewLevel == 'on' ? 'viewLevel':''),
            (addLevel == 'on' ? 'addLevel':''),
            (editLevel == 'on' ? 'editLevel':''),
            (statusLevel == 'on' ? 'statusLevel':''),
            (deleteLevel == 'on' ? 'deleteLevel':''),


            (viewChapter == 'on' ? 'viewChapter':''),
            (addChapter == 'on' ? 'addChapter':''),
            (editChapter == 'on' ? 'editChapter':''),
            (statusChapter == 'on' ? 'statusChapter':''),
            (deleteChapter == 'on' ? 'deleteChapter':''),

            (viewTeacher == 'on' ? 'viewTeacher':''),
            (addTeacher == 'on' ? 'addTeacher':''),
            (editTeacher == 'on' ? 'editTeacher':''),
            (statusTeacher == 'on' ? 'statusTeacher':''),
            (deleteTeacher == 'on' ? 'deleteTeacher':''),

            (viewStudent == 'on' ? 'viewStudent':''),
            (addStudent == 'on' ? 'addStudent':''),
            (editStudent == 'on' ? 'editStudent':''),
            (statusStudent == 'on' ? 'statusStudent':''),
            (deleteStudent == 'on' ? 'deleteStudent':''),
            
            (viewContact == 'on' ? 'viewContact':''),
            (mailContact== 'on' ? 'mailContact':''),
            (deleteContact == 'on' ? 'deleteContact':''),
        ],
    }).then(result =>{
        console.log(result)
        res.redirect('/dashboard/show_roles');
    }).catch(err => {
        console.log(err)
    })
 
  
});

module.exports=app;

