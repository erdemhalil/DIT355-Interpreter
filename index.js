const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://localhost:1883/")

client.on("connect", e => {
    console.log("connected")
    client.subscribe("/dentistimo/#", e => {
        client.on("message", (topic, m) => {
            let message = JSON.parse(m)
            if(message.request === 'post'){
                console.log("post", message.message)
                let response = {"id": message.id, "message": "data"}
                client.publish(topic, JSON.stringify(response))
            } else if(message.request === 'get'){
                console.log("get", message.message)
            } 
            console.log(message)
        })
    })
})




function getRequest(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function postRequest(url, data){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(data);
    return xmlHttp.responseText;
}
//axios
