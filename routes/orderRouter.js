const express =require('express');
var bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const mongoose = require('mongoose');
const jwt =require('jsonwebtoken');
const cors =require('cors');
const Order = require('../models/Order');
const orderRouter = new express.Router();
orderRouter.use(cors());
const handleError = function(err){
    console.log(err);
    return err;
};

orderRouter.get('/getall',async (req,res,next)=>{
    try{
        if(Order){
            const orders = await Order.find({});
            res.statusCode =200;
            res.send({success:true,orders});
            next();
        }
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
})

orderRouter.get('/getuserorders/:username',async (req,res,next)=>{
    try{
        const {username} = req.params;
        const orders = await Order.find({username:username});
        res.statusCode =200;
        res.send({success:true,orders});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
})

orderRouter.post('/add',async (req,res,next)=>{
    try{
        const{username,date,totalPrice,titles,status} =req.body;
        await Order.create({username:username,date:date,totalPrice:totalPrice,titles:titles,status:status});
        res.statusCode=200;
        res.send({message:'added successfully',success:true});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
});


orderRouter.patch('/adminedit/:id',async (req,res,next)=>{
    try{
        const {id}=req.params;
        const{status} =req.body;
        await Order.updateOne({_id:id},{status:status});
        res.statusCode=200;
        res.send({message:'updated successfully',success:true});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
});

orderRouter.delete('/delete/:id',async (req,res,next)=>{
    try{
        const {id}=req.params;
        await Order.deleteOne({_id:id});
        res.statusCode=200;
        res.send({message:'deleted successfully',success:true});
        next();
    }
    catch(err){
        res.statusCode = 401;
        res.send({success:false, message:err});
        return handleError(err);
    }
})


module.exports = orderRouter;

