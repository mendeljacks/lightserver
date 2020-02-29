import { redibase } from 'config/redibase'
const express = require('express')
const cors = require('cors')
var app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
const port = process.env.PORT ? process.env.PORT : 4411

app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.post('/mode', (req,res) => {
    if (req.body.mode !== false && req.body.mode !==true) return res.status(400).json('mode must be true or false')
    redibase.set('mode', req.body.mode)
    res.status(201).json('done')
})

io.on('connection', function (socket) {
    // console.log('a user connected')
    // socket.on('disconnect', function () {
    //     console.log('user disconnected')
    // })
    // socket.on('chat message', function (msg) {
    //     console.log('message: ' + msg)
    // })
    redibase.on('mode', async (old_val, new_val) => {
        socket.emit('mode', new_val)
    })
})

http.listen(port, function () {
    console.log('listening on port', port);
});



