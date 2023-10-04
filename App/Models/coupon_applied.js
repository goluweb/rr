var database = require(__dirname+'/../../config/Database');


const coupon1 = database.Schema({

    user_id:{
        type:database.Schema.Types.ObjectId,
        ref:'studentModel',
        required:true,
    },

    coupon:{
        type:database.Schema.Types.ObjectId,
        ref:'coupon',
        required:true, 
    },

    status:{
        type:Number,
        
    },

    added_on:{
        type:Date,
        default: new Date(),
    }



})


const couponModel1 = database.model('coupon_applied',coupon1);

module.exports=couponModel1;