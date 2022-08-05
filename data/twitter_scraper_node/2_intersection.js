//execute as `node 2_intersection.js > 2_intersection.json`

let fs = require("fs");
process.stderr.write(`If there are inconsistency in the data, they will be displayed in the stderr\n`);
process.stderr.write(`You will need to manually go through the JSON file and and fix them\n`);
process.stderr.write(`Hopefully the number of errors will be managable.\n`);
process.stderr.write(`When I tried it in Aug. 5 2022, there were 18 errors, and they were all on "no owner found"\n`);
process.stderr.write(`I was able to fix them by ctrl+f the problematic ID in the result file\n`);



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
        process.stderr.write(`no account found: ${JSON.stringify(sen,null,4)}\n`);
    }
    for(let account of accounts){
        account.owners.push(sen);
    }
}

//multiple potential owners, this will need to be resolved by hand
//execute `node 2_intersection.js > 2_intersection.json` and search through the file and correct it
for(let account of sen_all){
    if(account.owners.length === 0){
        process.stderr.write(`no owner found: id = ${account.id}\n`);
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
    //process.stderr.write(`multiple potential owners: ${JSON.stringify(account,null,4)}\n`);
    process.stderr.write(`multiple potential owners: id = ${account.id}\n`);
}


console.log(JSON.stringify({
    sen_100,sen_all
},null,4));






