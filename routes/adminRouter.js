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
const Admin = require('../models/Admin');

const adminRouter = new express.Router();
adminRouter.use(cors());
const handleError = function(err){
    console.log(err);
    return err;
};

adminRouter.post('/register',async (req,res,next)=>{
    try{
        const {username,email,password,gender,image} = req.body;
        const hash = await bcrypt.hash(password,10);
        const admin = await Admin.create({username:username,email:email,password:hash,gender:gender,image:image}); 
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

adminRouter.post('/login', async(req,res,next)=>{
    try{
        const {username,password} = req.body;
        const admin =await Admin.findOne({username:username});
        if(!admin){
            err =new Error("wrong username or password");
            res.statusCode = 401;
            res.send(err);
            return handleError(err);
        }

        const isMatch =await bcrypt.compare(password,admin.password);
        if(! isMatch){
            err =new Error("wrong username or password");
            res.statusCode = 401;
            res.send(err);
            return handleError(err);
        }
        const token = jwt.sign({id:admin.id},'my-signing-secret');
        const userName =admin.username;
        const image =admin.image;
        console.log(admin);
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

adminRouter.get('/profile',async (req,res,next)=>{
    try{
        const {authorization} =req.headers;
        const signedData = jwt.verify(authorization,'my-signing-secret');
        const admin = await Admin.findOne({_id:signedData.id},{password:0,__v:0});
        res.statusCode =200;
        res.send({success:true,admin});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:`Authentcation failed`})
        return handleError(err);
    }
})

adminRouter.patch('/profile/update/:id',async (req,res,next)=>{
    try{
        const {id} = req.params;
        const {username,email,password,gender,image} =req.body;
        const hash = await bcrypt.hash(password,10);
        const {authorization} =req.headers;
        const signedData = jwt.verify(authorization,'my-signing-secret');
        const result = await Admin.updateOne({_id:signedData.id},{username:username,email:email,password:hash,gender:gender,image:image});
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

module.exports = adminRouter;