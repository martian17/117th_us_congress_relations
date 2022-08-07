//filters the 4_connections.json file to include only connections from other senators
//the result will be stored in 5_filtered.json, and 5_stats.txt

let fs = require("fs");
let {stderr,DocGenerator} = require("./utils/util.js"); 

let senators = JSON.parse(fs.readFileSync("./3_senators_mapped.json"));
let connections = JSON.parse(fs.readFileSync("./4_connections.json"));

//get accounts
let accounts = {};
senators.map(sen=>sen.accounts.map(acc=>{
    acc.senator_id = sen.id;
    accounts[acc.id] = acc;
}));

let filtered = {};
for(let key in connections){
    filtered[key] = connections[key].filter(c=>c in accounts);
}

stderr.log("Filtering complete");

//writing out the stats
let stats = new DocGenerator();
stats.header(v=>`Table of contents:
Lines ${v()}-${v()}: Number of following in total
Lines ${v()}-${v()}: Number of senators they follow
Lines ${v()}-${v()}: Number of follows by other senators



`);

stats.append("# Number of following in total #\n");
stats.v();
stats.append(Object.entries(connections)
.sort((a,b)=>b[1].length-a[1].length)
.map(s=>[accounts[s[0]].name+": following "+s[1].length+" accounts in total"])
.join("\n"));
stats.v();

stats.append("\n\n\n\n");


stats.append("# Number of senators they follow #\n");
stats.v();
stats.append(Object.entries(filtered)
.sort((a,b)=>b[1].length-a[1].length)
.map(s=>[accounts[s[0]].name+": following "+s[1].length+" other senators"])
.join("\n"));
stats.v();

fs.writeFileSync("./5_stats.txt",stats.getContents(),"utf-8");
stderr.log("Various stats written to 5_stats.txt");

