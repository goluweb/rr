var database = require(__dirname+'/../../config/Database');


const coupon = database.Schema({

    type:{
        type:String,
        require:true
    },

    discount:{
        type:String,
        require:true
    },

    coupon:{
        type:String,
        require:true
    },
    added_on:{
        type:Date,
        default: new Date(),
    }
})


const couponModel = database.model('coupon',coupon);

module.exports=couponModel;