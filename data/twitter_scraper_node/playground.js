let fs = require("fs");
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


let {API_key, API_key_secret, Bearer_Token} = JSON.parse(fs.readFileSync("./tokens.json"));




let main = async function(){
    //api link
    //https://developer.twitter.com/en/docs/api-reference-index
    
    //test code with example request
    let response,result;
    response = await request_async({
        hostname:"api.twitter.com",
        port:443,
        path:"/2/tweets?ids=1261326399320715264,1278347468690915330",
        method:"GET",
        headers:{
            "Authorization": `Bearer ${Bearer_Token}`
        }
    },(request)=>{
        //do nothing
    });
    result = await get_response_body(response);
    console.log(result);
    console.log("\n");
    
    response = await request_async({
        hostname:"api.twitter.com",
        port:443,
        path:"/2/lists/63915645/members",
        //63915645 is the id of US senate list
        //page link: https://twitter.com/i/lists/63915645?lang=en
        method:"GET",
        headers:{
            "Authorization": `Bearer ${Bearer_Token}`
        }
    });
    result = await get_response_body(response);
    console.log(result);
    
    //for the interactive shell
    //use node-repl playground.js
    //https://github.com/martian17/node-repl
    //response = await request_async({hostname:"api.twitter.com",port:443,path:"/2/lists/63915645/members",method:"GET",headers:{"Authorization": `Bearer ${Bearer_Token}`}});result = await get_response_body(response);
};

//main();