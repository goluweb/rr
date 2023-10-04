var database = require(__dirname+'/../../config/Database');


const level = new database.Schema({

    levelName:{
        type:String,
        require:true,
    },

    levelImage:{
        type:String,
        require:true,
    },


    status:{
        type:Number,
        default:1,
    },

    date:{
        type:Date,
        default: new Date(),

    }

});

const levelObj = database.model('level_name',level);

module.exports=levelObj;