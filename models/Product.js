const mongoose= require('mongoose');
//■ Create product with title,image,price,details
const productschema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    }
})

const Product =mongoose.model('Product',productschema);
module.exports =Product;