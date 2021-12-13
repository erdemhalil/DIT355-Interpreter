const axios = require("axios")
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://localhost:1883/")
const Api = axios.create({
    baseURL: 'http://localhost:8000/api'
})

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
                getRequest(message.url).then(data => {
                    let response = {"id": message.id, "data": data} 
                    client.publish(topic, JSON.stringify(response))
                })
            } 
            console.log(message)
        })
    })
})

async function getRequest(url){
    let data = {}
    await Api.get(url).then(response => {
        data = response.data
    }).catch(e => {
        data = {"error": "404 Page Not Found"}
    })
    return data
}

function postRequest(url, data){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(data);
    return xmlHttp.responseText;
}
//axios
