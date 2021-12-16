const axios = require("axios")
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://localhost:1883/")
const Api = axios.create({
    baseURL: 'http://localhost:8000/api'
})

var  options = { qos: 1 }

client.on("connect", e => {
    console.log("connected")
    client.subscribe("/dentistimo/#", e => {
        client.on("message", (topic, m, option) => {
            if (m.length !== 0){
                try {
                    let message = JSON.parse(m)
                    if (message.request === 'post') {
                        postRequest(message.url, JSON.parse(message.data)).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), options)
                        })
                    } else if (message.request === 'get') {
                        getRequest(message.url).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), options)
                        })
                    }
                    console.log(option)
                } catch (e) {
                    let response = { "id": topic.split('/').pop(), "response": "response", "data": "400 Bad Request" }
                    return client.publish(topic, JSON.stringify(response), options)
                }
            } 
        })
    })
})

async function getRequest(url) {
    let data = {}
    await Api.get(url).then(response => {
        data = response.data
    }).catch(e => {
        data = { "error": e.response.status + " " + e.response.statusText }
    })
    return data
}

async function postRequest(url, data) {
    let res = {}
    await Api.post(url, data).then(response => {
        res = { "status": response.status + " " + response.statusText, "data": response.data }
    }).catch(e => {
        res = { "error": e.response.status + " " + e.response.statusText }
    })
    return res
}
