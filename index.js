const axios = require("axios")
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://localhost:1883/")
const Api = axios.create({
    baseURL: 'http://localhost:8000/api'
})

client.on("connect", e => {
    console.log("connected")
    client.subscribe("/dentistimo/#", {qos:1},e => {
        client.on("message", (topic, m, option) => {
            if (m.length !== 0){
                try {
                    let message = JSON.parse(m.toString())
                    if (message.request === 'post') {
                        postRequest(message.url, message.data, message.data.Authorization).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    } else if (message.request === 'get') {
                        getRequest(message.url, message.data.Authorization).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    }
                    console.log(option)
                } catch (e) {
                    let response = { "id": topic.split('/').pop(), "response": "response", "data": "400 Bad Requests" }
                    return client.publish(topic, JSON.stringify(response), {qos:1})
                }
            } 
        })
    })
})

async function getRequest(url, Autho) {
    let data = {}
    if(Autho != undefined){
        await Api.get(url, {headers: {Authorization: 'Bearer ' + Autho}}).then(response => {
            data = response.data
        }).catch(e => {
            data = { "error": e.response.status + " " + e.response.statusText }
        })
        return data
    } else {
        await Api.get(url).then(response => {
            data = response.data
        }).catch(e => {
            data = { "error": e.response.status + " " + e.response.statusText }
        })
        return data
    }
}

async function postRequest(url, data, Autho) {
    let res = {}
    if(Autho != undefined){
        await Api.post(url, data, {headers: {Authorization: 'Bearer ' + Autho}}).then(response => {
            res = { "status": response.status + " " + response.statusText, "data": response.data }
        }).catch(e => {
            res = { "error": e.response.status + " " + e.response.statusText }
        })
        return res
    } else {
        await Api.post(url, data).then(response => {
            res = { "status": response.status + " " + response.statusText, "data": response.data }
        }).catch(e => {
            res = { "error": e.response.status + " " + e.response.statusText }
        })
        return res
    }
}
