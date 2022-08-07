//the result will be stored in 2_intersection.json

let fs = require("fs");
let {stderr} = require("./utils/util.js");
stderr.log(`If there are inconsistency in the data, they will be displayed in the stderr`);
stderr.log(`You will need to manually go through the JSON file and and fix them`);
stderr.log(`Hopefully the number of errors will be managable.`);
stderr.log(`When I tried it in Aug. 5 2022, there were 18 errors, and they were all on "no owner found"`);
stderr.log(`I was able to fix them by ctrl+f the problematic ID in the result file`);



let sen_100 = JSON.parse(fs.readFileSync("../117th_senators_wikipedia.json"));
let sen_all = JSON.parse(fs.readFileSync("./1_senator_all.json"));

let arr_intersects = function(arr1,arr2){
    let score = 0;
    for(let v1 of arr1){
        for(let v2 of arr2){
            if(v1 === v2){
                score++;
            }
        }
    }
    return score;
};

for(let account of sen_all){
    account.owners = [];
}


//give id to senators
for(let i = 0; i < sen_100.length; i++){
    let sen = sen_100[i];
    sen.id = i;
}


for(let sen of sen_100){
    let words1 = sen.name.match(/[a-zA-Z]+/g);
    let accounts = [];
    //search the names through sen_all names
    let max_score = 0;
    for(let account of sen_all){
        let words2 = account.name.match(/[a-zA-Z]+/g);
        //check if words1 intersects with words2
        let score = arr_intersects(words1,words2);
        if(score === 0){
            continue;
        }
        if(score > max_score){
            accounts = [account];
            max_score = score;
        }else if(score === max_score){
            accounts.push(account);
        }
    }
    if(accounts.length === 0){
        stderr.log(`no account found: ${JSON.stringify(sen,null,4)}`);
    }
    for(let account of accounts){
        account.owners.push(sen);
    }
}

//handling multiple potential owners, this will need to be resolved by hand
for(let account of sen_all){
    if(account.owners.length === 0){
        stderr.log(`no owner found: id = ${account.id}`);
    }
    if(account.owners.length <= 1)continue;
    //performing correction
    let words1 = account.name.match(/[a-zA-Z]+/g);
    let owners = [];
    let max_score = 0;
    for(let sen of account.owners){
        let words2 = sen.name.match(/[a-zA-Z]+/g);
        let score = arr_intersects(words1,words2);
        if(score > max_score){
            owners = [sen];
            max_score = score;
        }else if(score === max_score){
            owners.push(sen);
        }
    }
    account.owners = owners;
    if(account.owners.length === 1)continue;
    //stderr.log(`multiple potential owners: ${JSON.stringify(account,null,4)}`);
    stderr.log(`multiple potential owners: id = ${account.id}`);
}


stderr.log(`Execution complete`);
fs.writeFileSync(
    "./2_intersection.json",
    //beautify the formatting
    JSON.stringify({
        sen_100,sen_all
    },null,4)+"\n",
    "utf-8"
);
stderr.log("Written the result to 2_intersection.json");






