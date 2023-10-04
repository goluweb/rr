
var database = require(__dirname+'/../../config/Database');


const TestSchema = new database.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles_id:{
        type: database.Schema.Types.ObjectId,
        ref: 'roles',
        required: true
    },
    number: {
        type: Number,
        required: true,
    },
    status:{
       type: Number,
       required:true,
    },

    date: {
        type: Date,
        default: new Date(),
        required: true,
    },
});

const adminLoginModel = database.model('admin_logins',TestSchema);

module.exports=adminLoginModel;