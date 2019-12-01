const events = require('events');
const Emitters = {}
const initEmitter = function(feed){
    if(!Emitters[feed]){
        Emitters[feed] = new events.EventEmitter().setMaxListeners(0)
    }
    return Emitters[feed]
}

module.exports = {initEmitter}