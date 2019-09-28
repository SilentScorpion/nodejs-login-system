const mongoose= require('mongoose');

const users = {
   name : {
       type : String,
       required: true
   },
   email : {
        type : String,
        required: true
    },
    password : {
        type : String,
        required: true
    },
    date : {
        type : Date,
        default: Date.now
    }
}

const UserSchema = new mongoose.Schema(users);

module.exports = mongoose.model('User',UserSchema);