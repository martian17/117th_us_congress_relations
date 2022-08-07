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

stderr.log("Processing outbound connections");
stderr.log("Filtering outbound following connections to only include senators");
let outbound = {};
for(let key in connections){
    outbound[key] = connections[key].filter(c=>c in accounts);
}
stderr.log("Filtering complete");
fs.writeFileSync("./5_outbound.json",JSON.stringify(outbound),"utf-8");
stderr.log("Written outbound connections to 5_outbound.json\n");




stderr.log("Processing inbound connections");
stderr.log("Mapping outbound connections to inbound connections");
let reverseGraphMapping = function(graph){
    let rev = {};
    for(let key in graph){
        rev[key] = [];
    }
    for(let gid in graph){
        for(rid of graph[gid]){
            rev[rid].push(gid);
        }
    }
    return rev;
};
let inbound = reverseGraphMapping(outbound);
stderr.log("outbound -> inbound mapping complete");
fs.writeFileSync("./5_inbound.json",JSON.stringify(inbound),"utf-8");
stderr.log("Written inbound connections to 5_inbound.json\n");



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
stats.append(Object.entries(outbound)
.sort((a,b)=>b[1].length-a[1].length)
.map(s=>[accounts[s[0]].name+": following "+s[1].length+" other senators"])
.join("\n"));
stats.v();

stats.append("\n\n\n\n");

stats.append("# Number of follows by other senators #\n");
stats.v();
stats.append(Object.entries(inbound)
.sort((a,b)=>b[1].length-a[1].length)
.map(s=>[accounts[s[0]].name+": followed by "+s[1].length+" other senators"])
.join("\n"));
stats.v();

fs.writeFileSync("./5_stats.txt",stats.getContents(),"utf-8");
stderr.log("Various stats written to 5_stats.txt");

