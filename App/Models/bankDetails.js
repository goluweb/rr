var database = require(__dirname+'/../../config/Database');

const bankDetails = database.Schema({

    adminLoginID:{
        type: database.Schema.Types.ObjectId,
        ref: 'admin_logins',
        required: true
    },
    bankHolderName:{
        type:String,
      
    },
    accountNumber:{
        type:Number,
        
    },
    bankName:{
        type:String,
       
    },
    ifscNumber:{
        type:String,
    
    },
    Date:{
        type:Date,
        default: new Date(),
        required:true
    }
});

const bankAllDetaile = database.model('bankDetails',bankDetails);

module.exports = bankAllDetaile;