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

let {Console} = require("console");
let stderr = new Console(process.stderr);

module.exports = {toQueries,Pause,stderr};