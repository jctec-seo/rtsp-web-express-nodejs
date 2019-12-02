const fs = require('fs');

const rtsps=function(){
    const Manager=function(){
        const rawdata = fs.readFileSync('./rtspSources.json');
        this.rtspRaw = JSON.parse(rawdata);
    };
    Manager.prototype.getLocation=function(idx){
        return this.rtspRaw[idx-1].location;
    };
    return new Manager();
}();
module.exports = rtsps;