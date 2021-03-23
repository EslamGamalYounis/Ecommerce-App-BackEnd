const express =require('express');
var bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const cors =require('cors');

const mongoose = require('mongoose');
const jwt =require('jsonwebtoken');
const Product = require('../models/Product');
const productRouter = new express.Router();
productRouter.use(cors());

const multer = require('multer');
// const fileFilter = (req,file,cb)=>{
//     //reject a file
//     if(file.mimeType==='image/jpeg'||file.mimeType==='image/jpg'||file.mimeType==='image/png'){
//         cb(null,true);
//     }
//     else{
//         cb(null,false);
//     }   
// }

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"images/");
    },
    filename:function(re,file,cb){
        cb(null,new Date().toISOString+file.originalname);
    }
});

const upload =multer({
    storage:storage,
    limits:{
    fileSize:1024*1024*5
    },
    // fileFilter:fileFilter
});

const handleError = function(err){
    console.log(err);
    return err;
};

productRouter.get('/allproducts', async (req,res,next)=>{
    try{
        const products = await Product.find({});
        res.statusCode =200;
        //res.send({success:true,products});
        res.send(products);
        next();
    }
    catch(err)
    {
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
})
//,multer({storage:storage}).single('image')
productRouter.post('/add',upload.single('productImage'),async (req,res,next)=>{
    
    try{
        const image = req.file;
        const{title,price,details,size} =req.body;
        const url = req.protocol+'://'+req.get("host");

        imageT=url+`/`+image.path;
        //console.log(imageT);
        await Product.create({title:title,image:imageT,price:price,details:details,size,size});
        res.statusCode=200;
        res.send({message:'added successfully',success:true});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
})

productRouter.patch('/edit/:id',upload.single('productImage'),async (req,res,next)=>{
    try{
        const id =req.params;
        const _id = mongoose.Types.ObjectId(id);
        const image = req.file;
        const{title,price,details,size} =req.body;
        const url = req.protocol+'://'+req.get("host");
        imageT=url+`/`+image.path;

        await Product.updateOne({_id:_id},{title:title,image:imageT,price:price,details:details,size,size});
        res.statusCode=200;
        res.send({message:'updated successfully',success:true});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
})

productRouter.delete('/delete/:title',async (req,res,next)=>{
    try{
        const{title} =req.params;
        console.log(title);
        const result = await Product.deleteOne({title:title});
        res.statusCode=200;
        res.send({message:'deleted successfully',success:true});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
});


module.exports = productRouter;