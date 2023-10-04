const express = require('express');
const app = express.Router();
const multer = require('multer');
const upload = multer();
const rolePermission = require(__dirname+'/../../middleware/PermissionCheck'); //middleware for session check
const loginModel = require(__dirname+'/../../Models/admin_login');
const rolesModel = require(__dirname+'/../../Models/roles');
const bankDetails = require(__dirname+'/../../Models/bankDetails');
const inArray = require('in-array'); 


app.get('/show_users',rolePermission('viewUser'),async (req,res)=>{
   
       loginModel.aggregate([
            {
        $lookup:{
                from:'roles',
                localField:'roles_id',
                foreignField:'_id',
                as:'data',
            },
        },
        ]).then((data)=>{
            res.render('admin/users/showUsers',{allUsers:data,inArray:inArray});
        }).catch((err)=>{
            console.log(err);
        });

    // loginModel.find().populate('roles').then((data)=>{
    //             console.log(data[0].data);
    //         }).catch((err)=>{
    //             console.log(err);
    //         });
    
});

app.get('/add_users',rolePermission('addUser'),async (req,res)=>{
    const allRoles = await rolesModel.find({});
    res.render('admin/users/addUser',{allRoles:allRoles,inArray:inArray});
});

app.post('/add_users',rolePermission('addUser'),upload.any(), async (req,res)=>{
    const {name,email,number,role,password,accountHolderName,accountNumber,bankName,ifscNumber}=req.body;


     const login = new loginModel({
        name:name,
        email:email,
        password:password,
        roles_id:role,
        number:number,
        status:1,

    });

   const bank = new bankDetails({
        adminLoginID:login._id,
        bankHolderName:accountHolderName,
        accountNumber:accountNumber,
        bankName:bankName,
        ifscNumber:ifscNumber,

    });
    await login.save();
    await bank.save();


    res.redirect('/users/show_users');

   
});


app.get('/delete_user/:id',rolePermission('deleteUser'),async(req,res)=>{
    const user_id = req.params.id
     loginModel.deleteOne({_id:user_id}).then((data)=>{
        bankDetails.deleteOne({adminLoginID:user_id}).then((data)=>{
               res.redirect('/users/show_users');
        }).catch((err)=>{
        console.log(err);
     });
     }).catch((err)=>{
        console.log(err);
     });
});


app.get('/edit_user/:id',rolePermission('editUser'),async(req,res)=>{
    const user_id = req.params.id;


    const allRoles = await rolesModel.find();
     bankDetails.findOne({adminLoginID:user_id}).populate('adminLoginID').then((data)=>{
     console.log(allRoles)
      res.render('admin/users/editUser',{AllUsers:data,allRoles,inArray:inArray});
    }).catch((err)=>{
            console.error(err.message);
         
    });

   
});

app.post('/edit_user/:id',rolePermission('editUser'),upload.any(),async(req,res)=>{
    user_id = req.params.id;

    const {name,email,number,role,password,accountHolderName,accountNumber,bankName,ifscNumber}=req.body;

    try{

    await loginModel.updateOne({_id:user_id },{
       name:name,
       email:email,
       password:password,
       roles_id:role,
       number:number,
       status:1,

   });

  await bankDetails.updateOne({adminLoginID : user_id },{

       bankHolderName:accountHolderName,
       accountNumber:accountNumber,
       bankName:bankName,
       ifscNumber:ifscNumber,

   });
    res.redirect('/users/show_users');    
}catch(err){
    console.log(err.message);
}
});


app.get('/status_user/:id/:status',rolePermission('statusUser'),async (req,res)=>{
      const id = req.params.id;
      const status = req.params.status;

      await loginModel.updateOne({_id:id},{status:status});
      res.redirect('/users/show_users');
      
});

module.exports = app;


