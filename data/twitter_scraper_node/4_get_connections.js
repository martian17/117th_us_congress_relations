//the result will be stored in 4_connections.json

let {get_all_data} = require("./utils/twitter_api.js");
let {stderr,Pause} = require("./utils/util.js");
let fs = require("fs");

let get_following_ids = async function(id){
    return (await get_all_data(`/2/users/${id}/following`,{max_results:1000})).map(acc=>acc.id);
};

stderr.log("This will take a while. The last time I executed it took 7 hours.");
stderr.log("The result will be incrementally stored in 4_connections.json, \
so you can quit and get back later if something unexpected happens");
stderr.log("I recommend you to occasionally back up 4_connections.json into 4_connections_backup.json \
while running this script. This is because the file might get corrupted and you might have to start \
all over again.");
stderr.log(`If you are running this script with "node 4_get_connections.js", I suggest you terminate this process \
with CTRL+C and run it again as "node-repl 4_get_connections.js" given you have node-repl installed as in the README instruction.`);
stderr.log(`This will give you an opportunity to inspect the state of the "connection" object as it gets built.\n\n\n`);


let senators = JSON.parse(fs.readFileSync("./3_senators_mapped.json"));
//read the current state of the log file
if(!fs.existsSync("./4_connections.json")){
    fs.writeFileSync("./4_connections.json","{}","utf-8");
}
let connections = JSON.parse(fs.readFileSync("./4_connections.json"));

let main = async function(){
    await Pause(1000);
    for(sen of senators){
        stderr.log(`\nSenator ${sen.name}`);
        for(acc of sen.accounts){
            if(acc.id in connections){
                stderr.log(`    Skipping account ${acc.name} as the entry already exists`);
                continue;
            }
            stderr.log(`    Requesting ${acc.name}`);
            connections[acc.id] = await get_following_ids(acc.id);
            fs.writeFileSync("./4_connections.json",JSON.stringify(connections),"utf-8");
        }
    }
    stderr.log("\nAll processes completed!!!\n");
    stderr.log("The results are stored inside the \"connections\" global variable");
    stderr.log("The senator metadata is available inside the \"senators\" global variable");
    stderr.log(`You can access them by running "node-repl 4_get_connections.js"`);
};

main();


