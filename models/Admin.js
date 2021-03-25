const mongoose= require('mongoose');

const adminSchema = new mongoose.Schema({
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

const Admin =mongoose.model('Admin',adminSchema);
module.exports =Admin;