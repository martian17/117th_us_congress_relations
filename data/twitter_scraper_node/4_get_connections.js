//the result will be stored in 4_connections.json

let {get_all_data} = require("./utils/twitter_api.js");
let {stderr} = require("./utils/util.js");
let fs = require("fs");

let get_following_ids = async function(id){
    return (await get_all_data(`/2/users/${id}/following`,{max_results:1000})).map(acc=>acc.id);
};



let senators = JSON.parse(fs.readFileSync("./3_senators_mapped.json"));
//read the current state of the log file
if(!fs.existsSync("4_connections.json")){
    fs.writeFileSync("./4_connections.json","{}","utf-8");
}
let connections = JSON.parse(fs.readFileSync("./4_connections.json"));

let main = async function(){
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
    stderr.log("all processes completed!!!");
    stderr.log("the result is stored inside the \"connections\" global variable");
    stderr.log("senator metadata is available inside the \"senators\" global variable");
};

main();


