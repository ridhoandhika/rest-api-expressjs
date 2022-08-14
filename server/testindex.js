const http = require('http')
const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const needle = require('needle')
const config = require('dotenv').config()
const TOKEN = process.env.TWITTER_BEARER_TOKEN
const PORT = process.env.PORT || 3000

const app = express()

const server = http.createServer(app)
const io = socketIO(server)

app.get('/tweet', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'index.html'))
})

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const streamURL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id'

const rules = [{ value: 'indihome' }]

// get stream rules
async function getRules(){
    const response = await needle('get', rulesURL, {
        headers:{
            Authorization: `Bearer ${TOKEN}`,
        }
    })

    console.log(response.body)
    return response.body
}

//set stream rules
async function setRules(){
    const data = {
        add: rules
    }

    const response = await needle('post', rulesURL, data, {
        headers:{
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        }
    })

    console.log(response.body)
    return response.body
}

async function deleteRules(rules){
    if(!Array.isArray(rules.data)){
        return null
    }
    const ids = rules.data.map((rules) => rules.id)
    const data = {
        delete: {
            ids: ids
        }
    }

    const response = await needle('post', rulesURL, data, {
        headers:{
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        }
    })

    console.log(response.body)
    return response.body
}

function streamTweets(socket) {
    const stream = needle.get(streamURL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
  
    stream.on('data', (data) => {
      try {
        const json = JSON.parse(data)
        console.log(json)
        socket.emit('tweet', json)
      } catch (error) {}
    })
  
    return stream
  }

io.on('connection', async () => {
    console.log('client connected...')

    let currentRules

    try {
        // get all stream rules
        currentRules = await getRules()

        //delete all stream rules
        await deleteRules(currentRules)

        //set rules based on array above
        await setRules()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }

    streamTweets(io)
})


// ;(async () => {
//     let currentRules

//     try {
//         // get all stream rules
//         // currentRules = await getRules()

//         //delete all stream rules
//         // await deleteRules(currentRules)

//         //set rules based on array above
//         // await setRules()

//     } catch (error) {
//         console.error(error)
//         process.exit(1)
//     }

//     streamTweets()
// })()

server.listen(PORT, () => console.log(`listen on ${PORT}`))

