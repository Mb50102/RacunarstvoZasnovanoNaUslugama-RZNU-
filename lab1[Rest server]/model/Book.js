const mongoose=require('mongoose');

const Bookschema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    author:{
        type:String,
        require:true
    }
})

module.exports=mongoose.model('Book',Bookschema);