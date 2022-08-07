//reads tokens and sets up twitter utility functions

let fs = require("fs");
let {request_async,get_response_body} = require("./request.js");
let {toQueries,Pause,stderr} = require("./util.js");
let path = require("path");
let {API_key, API_key_secret, Bearer_Token} = JSON.parse(fs.readFileSync(path.join(__dirname,"../tokens.json")));


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
                stderr.log(`    result contains no data, setting it to an empty array`);
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




module.exports = {
    //util function
    get_all_data,
    //data
    API_key,
    API_key_secret,
    Bearer_Token
};