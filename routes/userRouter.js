const express =require('express');
var bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const mongoose = require('mongoose');
const cors =require('cors');

const jwt =require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const userRouter = new express.Router();
userRouter.use(cors());
const handleError = function(err){
    console.log(err);
    return err;
};

userRouter.post('/register',async (req,res,next)=>{
    try{
        console.log(req.body);
        const {username,email,password,gender,image} = req.body;
        const hash = await bcrypt.hash(password,10);
        const user = await User.create({username:username,email:email,password:hash,gender:gender,image:image}); 
        res.statusCode =200;
        res.send({message:'register-successfully'});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send(err);
        return handleError(err);
    }
})

userRouter.post('/login', async(req,res,next)=>{
    try{
        const {username,password} = req.body;
        const user =await User.findOne({username:username});
        if(!user){
            err =new Error("wrong username or password");
            res.statusCode = 401;
            res.send(err);
            return handleError(err);
        }

        const isMatch =await bcrypt.compare(password,user.password);
        if(! isMatch){
            err =new Error("wrong username or password");
            res.statusCode = 401;
            res.send(err);
            return handleError(err);
        }
        const token = jwt.sign({id:user.id},'my-signing-secret');
        const userName =user.username;
        const image =user.image;
        res.statusCode =200;
        res.send({token:token,message:"login-successfully",userName,image});
        next();
    }
    catch(err){
        res.statusCode = 422;
        res.json({success:'false',message:err.message});
        return handleError(err);
    }
})

userRouter.get('/profile',async (req,res,next)=>{
    try{
        const {authorization} =req.headers;
        const signedData = jwt.verify(authorization,'my-signing-secret');
        const user = await User.findOne({_id:signedData.id},{password:0,__v:0});
        res.statusCode =200;
        res.send({success:true,user});
        next();
    }
    catch(err){
        console.log(err);
        res.statusCode = 401;
        res.send({success:false, message:`Authentcation failed`})
        return handleError(err);
    }
})

userRouter.patch('/profile/update',async (req,res,next)=>{
    try{
        const {username,email,password,gender,image} =req.body;
        const hash = await bcrypt.hash(password,10);
        const {authorization} =req.headers;
        const signedData = jwt.verify(authorization,'my-signing-secret');
        const result = await User.updateOne({_id:signedData.id},{username:username,email:email,password:hash,gender:gender,image:image});
        console.log(result);
        res.statusCode =200;
        res.send({message:'updated succefully',success:true});
        next();
    }
    catch(err){
        res.statusCode = 300;
        res.send({error:'invalid id',success:false});
        return handleError(err);
    }  
    });

module.exports = userRouter;

