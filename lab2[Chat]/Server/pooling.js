

const sendBtn = document.querySelector('#send');
const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');

var id=Math.floor(Math.random()*10000+1);


function getData(){
    var xhr = new XMLHttpRequest();
    var params=`id=${id}`
    console.log(params);
    xhr.open('GET','http://localhost:6969/message'+'?'+params);
    xhr.onload=()=>{
        console.log(xhr.status)
        if(xhr.status==200){
            console.log(xhr.response);
            showMessage(xhr.responseText)
        }
    }
    xhr.send();
}

function postData(){
    var message=messageBox.value;
    var xhr=new XMLHttpRequest();
    var body=JSON.stringify({lastmessage:message,id:id})
    xhr.open('POST','http://localhost:6969/messages');
    xhr.setRequestHeader('Access-Control-Allow-Origin','*')
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(body);
    showMessage(message);
}



setInterval(getData,1000);

sendBtn.addEventListener("click", postData);

function showMessage(message) {
    if(message!=null){
        messages.textContent += `\n\n${message}`;
        messages.scrollTop = messages.scrollHeight;
        messageBox.value = '';
    }
}