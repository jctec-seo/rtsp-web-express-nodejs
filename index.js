const {app, server, io}=require('./lib/init');
const rtspMan=require('./lib/rtsp-manager');
const express = require('express');
const child = require('child_process');
const spawn = child.spawn;

const PORT = process.env.PORT || 8001
const port=PORT==80 ? '': ':'+ PORT;

const childs= new Array(10);
app.use('/streamIn', require('./routers/streamIn'))
app.use(['/h264','/h264/:feed'], require('./routers/h264'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
io.on('connection', function (socket) {
    socket.on('getStream',function (feed) {
        //console.log(feed);
        const room='STREAM_'+ feed;
        if(childs[feed]===undefined)
            ensureStreamOpen(feed);
        socket.join(room);
    });
     socket.on('leave', function(feed){
         socket.leave('STREAM_'+ feed);
     });
});
function ensureStreamOpen(feed)
{
    const ch=parseInt(feed);
    const rtspLocation=rtspMan.getLocation(ch);
    const pa=['-rtsp_transport', 'tcp',
     '-i', 'rtsp://' +rtspLocation,
     '-f', 'mpegts', '-codec:v', 'mpeg1video',
     '-an', 'http://localhost' + port + '/streamIn/'+ feed];
    
    const mpeg=child.spawn('ffmpeg', pa);
    mpeg.on('close', function (buffer) {
        for(var i=0;i<childs.length;i++)
            if(childs[i]==this.pid){
                childs[i]=undefined;
                break;
            }
        console.log('ffmpeg ' + feed + ' died');
    });
    childs[ch]=mpeg.pid;
}