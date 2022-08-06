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

//utility functions
let Pause = function(ms){
    return new Promise((res,rej)=>{
        setTimeout(res,ms);
    });
};

let {Console} = require("console");
let stderr = new Console(process.stderr);


let {API_key, API_key_secret, Bearer_Token} = JSON.parse(fs.readFileSync("./tokens.json"));
let senators = JSON.parse(fs.readFileSync("./3_senators_mapped.json"));

let toQueries = function(obj){
    let arr = Object.entries(obj);
    if(arr.length === 0){
        return "";
    }else{
        return "?"+arr.map(([name,value])=>name+"="+value).join("&");
    }
};


let get_all_data = async function(url,queries={}){//queries is an object
    let result = [];
    let cnt = 0;
    while(true){
        stderr.log(`    page: ${cnt}`);
        let response = await request_async({
            hostname:"api.twitter.com",
            port:443,
            path:`${url}${toQueries(queries)}`,
            method:"GET",
            headers:{
                "Authorization": `Bearer ${Bearer_Token}`
            }
        });
        let r = JSON.parse(await get_response_body(response));
        //append the data
        if(("status" in r) && r.status === 429){
            stderr.log("    Twitter says too many requests, waiting 2 minutes before trying again");
            await Pause(2*60*1000);
            continue;
        }
        cnt++;
        if(!("meta" in r)){
            stderr.log(`    unknown failure mode\n    ${JSON.stringify(r)}`);
            process.exit();
        }
        if(!("data" in r)){
            if(r.meta?.result_count === 0){
                stderr.log(`result contains no data, setting it to an empty array`);
                r.data = [];
            }else{
                stderr.log(`    unknown failure mode\n    ${JSON.stringify(r)}`);
                process.exit();
            }
        }
        for(let entry of r.data){
            result.push(entry);
        }
        if("next_token" in r.meta){
            queries.pagination_token = r.meta.next_token;
        }else{
            stderr.log(`    all ${result.length} results have been retrieved\n    meta: ${JSON.stringify(r.meta)}`);
            break;
        }
    }
    return result;
};

let get_following_ids = async function(id){
    return (await get_all_data(`/2/users/${id}/following`,{max_results:1000})).map(acc=>acc.id);
};



let main = async function(){
    //read the current state of the log file
    if(!fs.existsSync("4_connections.json")){
        fs.writeFileSync("./4_connections.json","{}","utf-8");
    }
    let connections = JSON.parse(fs.readFileSync("./4_connections.json"));
    for(sen of senators){
        stderr.log(`\nlooking at ${sen.name}`);
        for(acc of sen.accounts){
            if(acc.id in connections){
                stderr.log(`    skipping ${acc.name} as it has been looked up before`);
                continue;
            }
            stderr.log(`    searching ${acc.name}`);
            connections[acc.id] = await get_following_ids(acc.id);
            fs.writeFileSync("./4_connections.json",JSON.stringify(connections),"utf-8");
        }
    }
    console.log("all processes completed!!!");
};

main()


