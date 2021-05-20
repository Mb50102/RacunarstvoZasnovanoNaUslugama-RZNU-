const { Router } = require('express');
const express = require('express');
const app = express();
const dotenv= require('dotenv');
const mongoose=require('mongoose');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "API",
        version: '1.0.0',
        name:"Marko Bartaković",
        description:"User book managment",
      },
    },
    apis: ["app.js","./routes/*.js"],
  };



const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

dotenv.config();



 //Import Routes
 const authRoute=require('./routes/auth');
 const bookRoute=require('./routes/books');
 const userRoute=require('./routes/users');


//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
{useNewUrlParser: true},
()=> console.log('connected to db!')
);

//Middleware
app.use(express.json());

//Routes Middleware
app.use('/api',authRoute);
app.use('/api', bookRoute);
app.use('/api',userRoute);

module.exports=app;