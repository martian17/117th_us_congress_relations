//execute as `node 1_senator_all.js 1_senator_all.json`
//results in 1_senator_all.json


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
    let pagination_token = null;
    let result = [];
    while(true){
        let response = await request_async({
            hostname:"api.twitter.com",
            port:443,
            path:`/2/lists/63915645/members${pagination_token?`?pagination_token=${pagination_token}`:""}`,
            //63915645 is the id of US senate list
            //page link: https://twitter.com/i/lists/63915645?lang=en
            method:"GET",
            headers:{
                "Authorization": `Bearer ${Bearer_Token}`
            }
        });
        let r = JSON.parse(await get_response_body(response));
        //append the data
        for(let entry of r.data){
            result.push(entry);
        }
        if("next_token" in r.meta){
            pagination_token = r.meta.next_token;
        }else{
            break;
        }
    }
    console.log("[\n"+result.map((s)=>{
        return "    "+JSON.stringify(s);
    }).join(",\n")+"\n]");
};

main();