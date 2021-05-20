const router =require('express').Router();
const verify=require('./verifyToken');
const Users =require('../model/User');
const Books=require('../model/Book');

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

router
    .route('/users')
/**
*@swagger 
*paths:
*  /api/users:
*    get:
*      description: get all users from database.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*      responses:
*        200:
*          description: OK
*/
    .get(verify, async (req,res)=>{
        const users = await Users.find();
        res.status(200).send(users);
    })
    
router
    .route('/users/:userid')
/**
*@swagger 
*paths:
*  /api/users/{userid}:
*    get:
*      description: get user from database with specific id.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user to get
*      responses:
*        200:
*          description: OK
*/
    .get(verify, async (req,res)=>{
            const userid = req.params.userid;

            const user = await Users.findOne({
                _id: userid
            });
        
            if(!user) return res.status(400).send('User doesn\'t exists!');

            try{
                const user = await Users.findOne(
                    { _id : userid}
                );
                res.status(200).send(user);      

            }catch(err){
                res.status(400).send('User doesnt exists!');
            }
           
           
    })
    /**
*@swagger 
*paths:
*  /api/users/{userid}:
*    delete:
*      description: delete user from database with specific id.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user to delete
*      responses:
*        200:
*          description: OK
*/
    .delete(verify, async (req,res)=>{
        const userid = req.params.userid;

        const user = await Users.findOne({
            _id: userid
        });
    
        if(!user) return res.status(400).send('User doesn\'t exists!');
        try{
            const response = await Users.deleteOne(
                { _id : userid}
            );
            res.status(200).send("User deleted!");      

        }catch(err){
            res.status(400).send(err);
        }
        
    })
/**
*@swagger 
*paths:
*  /api/users/{userid}:
*    put:
*      description: update user from database with specific id.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user to update
*        - in: body
*          name: user
*          desription: new user informations
*          schema:
*            type: object
*            required:
*              - name
*              - email
*              - password
*              - booksid
*            properties:
*              name:
*                type: string
*              email:
*                type: string
*              password:
*                type: string
*              booksid:
*                type: array
*                items:
*                  type: String
*      responses:
*        200:
*          description: OK
*/
    .put(async (req,res)=>{
        const userid=req.params.userid;
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(req.body.password,salt);
        try{
            const user=await Users.updateOne(
                {_id: userid},
                {$set:{name:req.body.name, 
                       email:req.body.email,
                       password: hashPassword,
                       booksId:req.body.booksId
                    }}
                );
                res.status(200).send(user);  
        }catch(err){
            res.status(400).send(err);
        }
    });


router
    .route('/users/:userid/books')
    /**
*@swagger 
*paths:
*  /api/users/{userid}/books:
*    get:
*      description: get all books from specific user.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user to get
*      responses:
*        200:
*          description: OK
*/
    .get(verify, async (req,res)=>{
        const userid = req.params.userid;

        const user = await Users.findOne({
            _id: userid
        });
    
        if(!user) return res.status(400).send('User doesn\'t exists!');

        const books=user.booksId;
        bookscolletion=[];
        for(i=0;i<books.length;i++){
            const book=await Books.findOne({
                _id: books[i]
            });
            bookscolletion.push(book)
            
        }       
        res.status(200).send(bookscolletion);
    })
    /**
*@swagger 
*paths:
*  /api/users/{userid}/books:
*    post:
*      description: add new book to a specific user.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user to get
*        - in: body
*          name: bookid
*          desription: book id to add to specific user
*          schema:
*            type: object
*            required:
*              - bookid
*            properties:
*              bookid:
*                type: string
*      responses:
*        200:
*          description: OK
*/
    .post(verify, async (req,res)=>{
        const userid = req.params.userid;
        const bookid = req.body.bookid;
        
        try{
            const book = await Books.findOne({
                _id: bookid
            });
        
            if(!book) return res.status(400).send('That book doesn\'t exists!');

        }catch(err){
            res.status(400).send('That book doesn\'t exists!');
        }
    


         try{
            const user = await Users.update(
                    { _id : userid},
                    {$push:{booksId:bookid}}
                    
                );
                res.status(201).send(user);
        }catch(err){
            res.status(400).send(err);

        }
    })
    /**
*@swagger 
*paths:
*  /api/users/{userid}/books:
*    delete:
*      description: delete all books that a particular user has.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user to get
*      responses:
*        200:
*          description: OK
*/
    .delete(verify, async (req,res)=>{
        const userid = req.params.userid;
        const user = await Users.findOne(
            { _id : userid}
        );      
        
        if(!user) return res.status(400).send('User doesnt exists!');

        try{
            const user = await Users.updateOne(
                    { _id : userid},
                    {$set:{booksId:[]}}
                    
                );
                res.status(200).send(user);
        }catch(err){
            res.status(400).send(err);

        }
    
    })



router
    .route('/users/:userid/books/:bookid')
    /**
*@swagger 
*paths:
*  /api/users/{userid}/books/{bookid}:
*    put:
*      description: add specific book to user.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user 
*        - in: path
*          name: bookid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of book to add to user
*      responses:
*        200:
*          description: OK
*/
    .put(verify, async (req,res)=>{
        const userid = req.params.userid;
        const bookid = req.params.bookid;
        try{
            const user = await Users.update(
                    { _id : userid},
                    {$push:{booksId:bookid}}
                    
                );
                res.status(200).send(user);
        }catch(err){
            res.status(400).send(err);

        }
    
    })
        /**
*@swagger 
*paths:
*  /api/users/{userid}/books/{bookid}:
*    delete:
*      description: delete specific book from user.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user 
*        - in: path
*          name: bookid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of book to delete from user
*      responses:
*        200:
*          description: OK
*/
    .delete(verify, async (req,res)=>{
        const userid = req.params.userid;
        const bookid = req.params.bookid;
        try{
            const user = await Users.update(
                    { _id : userid},
                    {$pull:{booksId:bookid}}
                    
                );
                res.status(200).send(user);
        }catch(err){
            res.status(400).send(err);

        }
    
    })
        /**
*@swagger 
*paths:
*  /api/users/{userid}/books/{bookid}:
*    get:
*      description: get specific book which user owns.
*      parameters:
*        - name: "auth-token"
*          in: "header"
*          required: true
*          type: "string"
*        - in: path
*          name: userid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the user 
*        - in: path
*          name: bookid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of book to get 
*      responses:
*        200:
*          description: OK
*/
    .get(verify, async (req,res)=>{
        const bookid = req.params.bookid;
        const userid = req.params.userid;
       
        const user = await Users.findOne(
            { _id : userid}
        );      
       
        if(!user) return res.status(400).send('User doesnt exists!');
        
        if(!(user.booksId.includes(bookid))) return res.status(400).send('User doesnt have that book');
        try{
            const book = await Books.findOne(
                    { _id : bookid},
                 );
                
                res.status(200).send(book);
        }catch(err){
            res.status(400).send(err);

        }
    
    })
    


module.exports=router;
