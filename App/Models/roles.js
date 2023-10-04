var database = require(__dirname+'/../../config/Database');


const rolesSchema = new database.Schema({
    roles: {
        type: String,
        required: true,
    },

    permission: {
        type: Array,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(),
        required: true,
    },
});

const roles = database.model('roles',rolesSchema);

module.exports=roles;