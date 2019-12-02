const {app, server, io}=require('./lib/init');
const rtspMan=require('./lib/rtsp-manager');
const child = require('child_process');

const PORT = process.env.PORT || 8001
const port=PORT==80 ? '': ':'+ PORT;

const childs= new Array(10);
app.use('/streamIn', require('./routers/streamIn'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
io.on('connection', function (socket) {
    socket.on('getStream',function (feed) {
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
    const param=rtspMan.getParam(ch);
    const args=param + ' http://localhost' + port + '/streamIn/'+ feed;
    
    const mpeg=child.spawn('ffmpeg', args.split(' '));
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