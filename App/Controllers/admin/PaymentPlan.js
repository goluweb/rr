const express = require('express');
const app = express.Router();
const multer = require('multer');
const upload = multer();
const imgUploadImddleware = require(__dirname+'/../../middleware/uploadImage');
const rolePermission = require(__dirname+'/../../middleware/PermissionCheck'); //middleware for session check
const levelModel = require(__dirname+'/../../Models/level');
const paymentModel = require(__dirname+'/../../Models/payment');
const courseModel = require(__dirname+'/../../Models/playList');
const inArray = require('in-array'); 
const couponModel = require(__dirname+'/../../Models/coupon');




app.get('/addpayment',rolePermission('addLevel'),async(req,res)=>{
    const course =  await courseModel.find({status:1});
    res.render('admin/payment/add_payment',{inArray:inArray,course:course});
});

app.get('/show_payment',rolePermission('addLevel'),async(req,res)=>{
    const payment =  await paymentModel.find().populate('playlist_id');
    console.log(payment)
    res.render('admin/payment/show_payment',{inArray:inArray,payment:payment});
});

app.post('/addpayment',rolePermission('addLevel'),async (req,res)=>{
    const {course,fee,disount } = req.body;
    paymentModel({
        playlist_id: course,
       fee:fee,
       discount:disount
    }).save().then((data)=>{
        res.redirect('/payment/show_payment');
    }).catch((err)=>{
        console.error(err);
    });
});




app.get('/edit_payment/:id',rolePermission('editLevel'),async (req,res)=>{
    const id = req.params.id;
    const course =  await courseModel.find({status:1});

    console.log(course);
    paymentModel.findOne({_id:id}).then(reslut=>{
        res.render('admin/payment/edit_payment',{payment:reslut,course:course,inArray:inArray});
    }).catch(err => {
        console.err(err);
    })
    
})

app.post('/edit_payment/:id',rolePermission('editLevel'),async(req,res)=>{
    const {course,fee,disount } = req.body;
    const {id}=req.params
    paymentModel.updateOne({_id:id},{
       playlist_id: course,
       fee:fee,
       discount:disount
    }).then((data)=>{
        res.redirect('/payment/show_payment');
    }).catch((err)=>{
        console.error(err);
    });
})

app.get('/delete_payment/:id',rolePermission('deleteLevel'),async(req,res)=>{
    const id = req.params.id;
    await paymentModel.deleteOne({_id:id});
    res.redirect('/payment/show_payment');
});


///////////////coupons/////////////////////////


app.get('/add_coupon',(req,res)=>{

    res.render('admin/coupon/add_coupon',{inArray:inArray});

})


app.post('/add_coupon',(req,res)=>{
   
    const {type,disount,coupon} = req.body;
    couponModel.create({
        type:type,
        discount:disount,
        coupon:coupon
    }).then((data)=>{
        res.redirect('/payment/coupons');
    }).catch((err)=>{
        res.send(err.message);
    })
})


app.get('/coupons',async(req,res)=>{
    const coupon = await couponModel.find();
    res.render('admin/coupon/show_coupon',{inArray:inArray,coupon:coupon})
})

app.get('/edit_coupon/:id',async(req,res)=>{
  
    const {id} = req.params;
    
    const coupon = await couponModel.findOne({_id:id})

    res.render('admin/coupon/edit_coupon',{coupon:coupon,inArray:inArray});

})

app.get('/delete_coupon/:id',async(req,res)=>{
    const {id} = req.params;
    const coupon = await couponModel.deleteOne({_id:id});
    res.redirect('/payment/coupons');
})

module.exports = app; 

