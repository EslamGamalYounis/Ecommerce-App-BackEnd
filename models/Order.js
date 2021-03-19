const mongoose= require('mongoose');

//username,date,total price,product titles only)
const orderScema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:Date,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    titles:{
        type:[String],
        required:true
    },
    status:{
       type:String,
       required:true 
    }
})
