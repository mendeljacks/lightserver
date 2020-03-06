import { redibase } from 'config/redibase'
const express = require('express')
const cors = require('cors')
var app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
const port = process.env.PORT ? process.env.PORT : 4411

app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.post('/mode', async (req,res) => {
    if (req.body.mode !== false && req.body.mode !==true) return res.status(400).json('mode must be true or false')
    try {
        const response = await redibase.set('mode', req.body.mode)
        res.status(201).json('done')
    } catch (error) {
        res.status(400).json(error)
    }
})

io.on('connection', async function (socket) {
    const initial_mode = await redibase.get('mode')
    socket.emit('mode', initial_mode)
    socket.emit('user_count', socket.client.conn.server.clientsCount)
    socket.broadcast.emit('user_count', socket.client.conn.server.clientsCount)
    // console.log('a user connected')
    // socket.on('disconnect', function () {
    //     console.log('user disconnected')
    // })
    // socket.on('chat message', function (msg) {
    //     console.log('message: ' + msg)
    // })
    redibase.on('mode', async (new_val, old_val) => {
        socket.emit('mode', new_val)
    })
    socket.on('disconnect', async function () {
        socket.broadcast.emit('user_count', socket.client.conn.server.clientsCount)
    })
})


http.listen(port, function () {
    console.log('listening on port', port);
});



