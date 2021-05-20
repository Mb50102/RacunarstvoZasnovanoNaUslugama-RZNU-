const Book = require('../model/Book');

const router=require('express').Router();

router
    .route('/books')
    /**
*@swagger 
*paths:
*  /api/books:
*    get:
*      description: get all books from database.
*      responses:
*        200:
*          description: OK
*/
    .get( async (req,res)=>{
        const books = await Book.find();
        res.status(200).send(books);
    })
    /**
*@swagger 
*paths:
*  /api/books:
*    post:
*      description: create a new book.
*      consumes:
*        - application/json
*      parameters:
*        - in: body
*          name: book
*          desription: book to create
*          schema:
*            type: object
*            required:
*              - name
*              - author
*            properties:
*              name:
*                type: string
*              author:
*                type: string
*      responses:
*        201:
*          description: CREATED
*/
    .post(async (req,res)=>{
        const book=new Book({
            name: req.body.name,
            author:req.body.author
        });
        try{
            const savedBook=await book.save();
            res.status(201).send(savedBook);
        }catch(err){
            res.status(400).send(err);
        }

    })

router
    .route('/books/:bookid')
/**
*@swagger 
*paths:
*  /api/books/{bookid}:
*    get:
*      description: get book by id.
*      parameters:
*        - in: path
*          name: bookid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the book to get
*      responses:
*        200:
*          description: OK
*/
    .get( async (req,res)=>{
        const bookId=req.params.bookid;
        try{
            const book=await Book.findOne({
                _id: bookId
            });
            res.status(200).send(book);  
        }catch(err){
            res.status(400).send(err);
        }
    })
    /**
*@swagger 
*paths:
*  /api/books/{bookid}:
*    delete:
*      description: delete book by id.
*      parameters:
*        - in: path
*          name: bookid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the book to delete
*      responses:
*        200:
*          description: OK
*/
    .delete(async (req,res)=>{
        const bookId=req.params.bookid;
        try{
            const book=await Book.deleteOne({
                _id: bookId
            });
            res.status(200).send(book);  
        }catch(err){
            res.status(400).send(err);
        }
    })
    /**
*@swagger 
*paths:
*  /api/books/{bookid}:
*    put:
*      description: update book.
*      consumes:
*        - application/json
*      parameters:
*        - in: path
*          name: bookid
*          schema:
*            type: integer
*          required: true
*          description: Numeric ID of the book to update
*        - in: body
*          name: book
*          desription: new book informations
*          schema:
*            type: object
*            required:
*              - name
*              - author
*            properties:
*              name:
*                type: string
*              author:
*                type: string
*      responses:
*        200:
*          description: OK
*/
    .put(async (req,res)=>{
        const bookId=req.params.bookid;
        try{
            const book=await Book.updateOne(
                {_id: bookId},
                {$set:{name:req.body.name, author:req.body.author}}
                );
                res.status(200).send(book);  
        }catch(err){
            res.status(400).send(err);
        }
    });


module.exports=router;