while(true) {  
  if(document.getElementById('websocket').checked){
    document.getElementById("protocolInUse").innerHTML="current protocol in use: websocket";
    document.getElementById('submit').style.visibility = 'hidden';

    const sendBtn = document.querySelector('#send');
    const messages = document.querySelector('#messages');
    const messageBox = document.querySelector('#messageBox');

    let ws;

    function showMessage(message) {
      messages.textContent += `\n\n${message}`;
      messages.scrollTop = messages.scrollHeight;
      messageBox.value = '';
    }

    function init() {
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
      }

      ws = new WebSocket('ws://localhost:6969');
      ws.onopen = () => {
        console.log('Connection opened!');
      }
      ws.onmessage = ({ data }) => showMessage(data);
      ws.onclose = function() {
        ws = null;
      }
    }

    sendBtn.onclick = function() {
      if (!ws) {
        showMessage("No WebSocket connection :(");
        return ;
      }

      ws.send(messageBox.value);
      showMessage(messageBox.value);
    }

    
   
  }else if(document.getElementById('pooling').checked){
    document.getElementById("protocolInUse").innerHTML="current protocol in use: pooling";
    document.getElementById('submit').style.visibility = 'hidden';
  }else if(document.getElementById('longpooling').checked){
    document.getElementById("protocolInUse").innerHTML="current protocol in use: longpooling";
    document.getElementById('submit').style.visibility = 'hidden';
  }

}


sendBtn.onclick = function() {
  if (!ws) {
    showMessage("No WebSocket connection :(");
    return ;
  }

  ws.send(messageBox.value);
  showMessage(messageBox.value);
}