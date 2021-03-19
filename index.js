const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
require('./db-connection');

const cors =require('cors');
app.use(cors());

const userRouter = require('./routes/userRouter');
const adminRouter =require('./routes/adminRouter');
const productRouter =require('./routes/productRouter');
const orderRouter =require('./routes/orderRouter');
const PORT = process.env.PORT || 3000;
const jwt =require('jsonwebtoken');

app.use('/images',express.static('images'));

app.use((req, res, next) => {
    // allow any port to request on nodejs server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin , X-Requested-With , Content-Type , Accept , authorization '
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, PUT, OPTIONS'
    );
    next();
});

app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/product',productRouter);
app.use('/api/order',orderRouter);

app.use((err, req, res, next) =>{
    console.error(err)
    res.status(500);
    res.send({error:'internal server error'})
    next();
  })

app.listen(PORT,()=>{
    console.info('server listen in port '+PORT);
})