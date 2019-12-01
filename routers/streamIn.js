const { app, server, io } = require('../lib/init')
const express = require('express');
const router = express.Router();
const {initEmitter} = require('../lib/emitter')

router.all('/:feed', function(req, res) {
	const {feed = '1'} = req.params;
	const emit = initEmitter(feed);
    //feed = Feed Number (Pipe Number)
	req.on('data', function(buffer){
		emit.emit('data',buffer);
		io.to('STREAM_'+feed)
			.emit('h264',{feed ,buffer});
	});

	res.connection.setTimeout(0);
})

module.exports = router