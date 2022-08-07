//util functions
let toQueries = function(obj){
    let arr = Object.entries(obj);
    if(arr.length === 0){
        return "";
    }else{
        return "?"+arr.map(([name,value])=>name+"="+value).join("&");
    }
};


let Pause = function(ms){
    return new Promise((res,rej)=>{
        setTimeout(res,ms);
    });
};

//extends the original console to save the stream it was constructed with
class Console extends require("console").Console{
    constructor(stream){
        super(...arguments);
        this.stream=stream;
    }
};

let stderr = new Console(process.stderr);

module.exports = {toQueries,Pause,Console,stderr};