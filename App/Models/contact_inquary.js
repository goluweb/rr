var database = require(__dirname+'/../../config/Database');


const inquery = database.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
        required:true
    },
    requirement:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    added_on:{
        type:Date,
        default: new Date()
    }

})

const contectIquery = database.model('contact_inqery',inquery);

module.exports=contectIquery;