//the result will be stored in 3_senators_mapped.json

let fs = require("fs");
let {stderr} = require("./utils/util.js");
let {sen_all,sen_100} = JSON.parse(fs.readFileSync("./2_intersection_corrected.json"));


//add accounts field to sen_100
for(let sen of sen_100){
    sen.accounts = [];
}

//map the account to sen_100
for(let account of sen_all){
    if(account.owners.length !== 1){
        stderr.log(`irregular account: ${JSON.stringify(account,null,4)}\n`);
        continue;
    }
    let owner = account.owners[0];
    sen_100[owner.id].accounts.push(account);
    delete account.owners;
}

stderr.log(`Execution complete`);
fs.writeFileSync(
    "./3_senators_mapped.json",
    //beautify the formatting
    JSON.stringify(sen_100,null,4)+"\n",
    "utf-8"
);
stderr.log("Written the result to 2_intersection.json\n");

stderr.log("There may be some irregular accounts that are not associated with any of the 100 senators,");
stderr.log("But you can ignore them if they are of non-senator or retired senators");
