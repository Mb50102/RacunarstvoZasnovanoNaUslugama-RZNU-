const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const { request } = require('https');
const { resolve } = require('path');
const { nextTick } = require('process');
const { callbackify } = require('util');
const { client, w3cwebsocket } = require('websocket');
const WebSocket = require('ws');

var cors = require("cors");
const { Console } = require('console');


const port = 6969;

var app=express()
app.use(cors({origin:'*'}));
var jsonParser = bodyParser.json()
 
const server = http.createServer(app);
const wss = new WebSocket.Server({ server })

var lastMessageId1=null;
var lastMessageId2=null;

var id1=null;
var id2=null;

var newMessageId1=false;
var newMessageId2=false;

//Pooling
app.post('/messages',jsonParser,function(req,res){
  console.log(`got new message: ${req.body.lastmessage}, from: ${req.body.id}`)
  if(id1==null || id2==null){
    if(id1==null){
      id1=req.body.id
      lastMessageId1=req.body.lastmessage
      newMessageId1=true;
      wss.poolingBroadcast(lastMessageId1);
    }else{
      id2=req.body.id
      lastMessageId2=req.body.lastmessage
      newMessageId2=true;
      wss.poolingBroadcast(lastMessageId2);
    }
  }else{
    if(req.body.id==id1){
      newMessageId1=true;
      lastMessageId1=req.body.lastmessage
      wss.poolingBroadcast(lastMessageId1)
      res.status(200)
      res.send();
      
    }else if(req.body.id==id2){
      newMessageId2=true;
      lastMessageId2=req.body.lastmessage
      wss.poolingBroadcast(lastMessageId2)
      res.status(200)
      res.send();
    }
  }  

})

app.get('/message', function(req,res){
  var id=req.query.id
   if(id1!=null && id!=id1 && id2==null){
      id2=id
    }else if(id2!=null && id!=id2 && id1==null){
      id1=id
    }

  console.log(id);
  if(id==id1 && newMessageId2){
    console.log("NewMessage for id1");
    res.header('Access-Control-Allow-Origin','*')
    res.status(200)
    console.log(`lastmessagid2 ${lastMessageId2}`)
    res.send(lastMessageId2);
    res.end(newMessageId2=false);
    
  }else if(id==id2 && newMessageId1){
    console.log("NewMessage for id2");
    res.header('Access-Control-Allow-Origin','*')
    res.status(200)
    
    console.log(`lastmessagid2 ${lastMessageId1}`)
    res.send(lastMessageId1);
    res.end(newMessageId1=false)
  }
  else{
    res.header('Access-Control-Allow-Origin','*')
    res.status(204)
    res.send();
  }

})
//LongPooling
app.get('/longPoolingmessage', async function(req,res){
  var id=req.query.id
   if(id1!=null && id!=id1 && id2==null){
      id2=id
    }else if(id2!=null && id!=id2 && id1==null){
      id1=id
    }

  console.log(id);
  
  function sendMessage(){
    
    if(id==id1 && newMessageId2){
      console.log("NewMessage for id1");
      res.status(200)
      res.header('Access-Control-Allow-Origin','*')
      console.log(`lastmessagid2 :${lastMessageId2}`)
      res.send(lastMessageId2);
      res.end(newMessageId2=false);
      return

    }else if(id==id2 && newMessageId1){
      console.log("NewMessage for id2");
      res.status(200)
      res.header('Access-Control-Allow-Origin','*')
      console.log(`lastmessagid2: ${lastMessageId1}`)
      res.send(lastMessageId1);
      res.end(newMessageId1=false) 
      return
    }
    setImmediate(sendMessage)
  }
  sendMessage()
})



//WebSocket
wss.on('connection', function connection(ws) {
  console.log("new connection");
  if(id1==null){
    id1="ws1";
    if(id2!=null && newMessageId2==true){
      wss.broadcast(lastMessageId2,ws)
      newMessageId2=false;
    }
  }else if(id2==null){
    id2="ws2";
    if(id1!=null && newMessageId1==true){
      wss.broadcast(lastMessageId1,ws)
      newMessageId1=false;
    }
  }

  ws.on('message', function incoming(data) {
    console.log(data);
    
    if(id1=="ws1"){
      newMessageId1=true;
      lastMessageId1=data
    }else if(id2=="ws2"){
      newMessageId2=true;
      lastMessageId2=data;
    }
    
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  })
})

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
})


//WebSocket helper functions

wss.broadcast = function(lastMessage,sender) {
  wss.clients.forEach(function each(client) {
    if (client == sender) {
      client.send(lastMessage);
    }
  })
};

wss.poolingBroadcast=function(messageToSend){
  wss.clients.forEach(function each(client){
    client.send(messageToSend)
  })
}

