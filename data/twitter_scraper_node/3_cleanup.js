let fs = require("fs");

let {sen_all,sen_100} = JSON.parse(fs.readFileSync("./2_intersection_corrected.json"));


//add accounts field to sen_100
for(let sen of sen_100){
    sen.accounts = [];
}

//map the account to sen_100
for(let account of sen_all){
    if(account.owners.length !== 1){
        process.stderr.write(`irregular account: ${JSON.stringify(account,null,4)}\n`);
        continue;
    }
    let owner = account.owners[0];
    sen_100[owner.id].accounts.push(account);
    delete account.owners;
}

console.log(JSON.stringify(sen_100,null,4));
