const express = require('express')
const {initEmitter} = require('../lib/emitter')

const router = express.Router()

//simulate RTSP over HTTP
router.get('/', function (req, res) {
	const {feed = '1'} = req.params
    const contentWriter = (buffer) => res.write(buffer)
	
	const emit = initEmitter(feed)
    emit.on('data',contentWriter)
    res.on('close', function () {
        emit.removeListener('data',contentWriter)
	})
	
    res.writeHead(200, {
        'Date': (new Date()).toUTCString(),
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Content-Type': 'video/mp4',
        'Server': 'Shinobi H.264 Test Stream',
    });
});

module.exports = router