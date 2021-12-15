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
            if (m.length !== 0){
                try {
                    let message = JSON.parse(m)
                    if (message.request === 'post') {
                        postRequest(message.url, JSON.parse(message.data)).then(data => {
                            let response = { "id": message.id, "data": data }
                            client.publish(topic, JSON.stringify(response))
                        })
                    } else if (message.request === 'get') {
                        getRequest(message.url).then(data => {
                            let response = { "id": message.id, "data": data }
                            client.publish(topic, JSON.stringify(response))
                        })
                    }
                } catch (e) {
                    let response = { "id": topic.split('/').pop(), "data": "400 Bad Request" }
                    client.publish(topic, JSON.stringify(response))
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
