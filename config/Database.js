const mongoose =  require('mongoose');
require('dotenv').config();
const database = process.env.DB_NAME;


mongoose.connect('mongodb+srv://webdeveloper1:IK9ez3LQ91YwQU7F@cluster0.6qnw3vh.mongodb.net/myDatabase?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
  console.log('Connected to database!');
}).catch((error) => {
    console.log('Connection failed!', error);
});

module.exports = mongoose;
