const router=require('express').Router();
const User=require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

/**
*@swagger 
*paths:
*  /api/register:
*    post:
*      description: Register a new user.
*      consumes:
*        - application/json
*      parameters:
*        - in: body
*          name: user
*          desription: The user to create
*          schema:
*            type: object
*            required:
*              - name
*              - email
*              - password
*            properties:
*              name:
*                type: string
*              email:
*                type: string
*              password:
*                type: string
*      responses:
*        201:
*          description: CREATED
*/


router.post('/register',async (req,res)=>{
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //check if user is in database
    const emailExist = await User.findOne({
        email: req.body.email
    });

    if(emailExist) return res.status(400).send('Email already exists!');

    //hash password
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(req.body.password,salt);

    //create a new user
    const user=new User({
       name: req.body.name,
       email: req.body.email,
       password: hashPassword
    });
    try{
       const savedUser=await user.save();
       res.status(201).send(savedUser);
    }catch(err){
       res.status(400).send(err);
    }
});


//login

/**
*@swagger 
*paths:
*  /api/login:
*    post:
*      description: login in page.
*      consumes:
*        - application/json
*      parameters:
*        - in: body
*          name: user
*          desription: email and password for login
*          schema:
*            type: object
*            required:
*              - email
*              - password
*            properties:
*              email:
*                type: string
*              password:
*                type: string
*      responses:
*        200:
*          description: OK
*/
router.post('/login', async (req,res)=>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

     //check if user is in database
     const user = await User.findOne({
        email: req.body.email
    });

    if(!user) return res.status(400).send('Email doesnt exist!');

    const validPassword= await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send('Invalid password');

    // create jwt
    const token=jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);


});

module.exports=router;
