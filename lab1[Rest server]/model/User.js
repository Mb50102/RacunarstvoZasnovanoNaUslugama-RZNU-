const { string } = require('@hapi/joi');
const mongoose=require('mongoose');
const Bookschema = require('./Book').schema;



const Userschema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        min:6
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:255
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now
    },

    booksId:[String]
        
});

module.exports=mongoose.model('User',Userschema);