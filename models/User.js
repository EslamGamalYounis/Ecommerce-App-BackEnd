const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
        default:"IMAGE"
    }
}) 

const User =mongoose.model('User',userSchema);
module.exports =User;

