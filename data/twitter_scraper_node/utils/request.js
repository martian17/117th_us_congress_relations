//a simple wrapper for https request in an async format

let https = require("https");


let request_async = function(obj,cb=()=>{}){
    return new Promise((resolve,reject)=>{
        const request = https.request(obj, response => {
            resolve(response);
        });
        request.on("error",err=>{
            reject(err);
        });
        cb(request);
        request.end();
    });
};

let get_response_body = function(response){
    return new Promise((resolve,reject)=>{
        let result = "";
        response.on("data",(d)=>{
            result += d;
        });
        response.on("end",()=>{
            resolve(result);
        });
        response.on("error",()=>{
            reject(new Error("response error"));
        });
    });
};

module.exports = {request_async,get_response_body};