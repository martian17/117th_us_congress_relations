//the result will be stored in 2_intersection.json

let fs = require("fs");
let {stderr} = require("./utils/util.js");
stderr.log(`Errors will be displayed below with description.`);
stderr.log(`Please go to 2_intersection.json, resolve them, and store the result in 2_intersection_corrected.json\n`);

stderr.log(`When I ran this script in Aug. 5 2022, there were 18 errors, and they were all on "no owner found"`);
stderr.log(`I was able to fix them by ctrl+f the problematic ID in the result file\n`);

stderr.log(`If you can't manually find the account owner in the list of senators, \
it might be that the senator is retired. In such a case, add a note in the JSON object that they are retired, as in this example:`);
stderr.log(`{
    "id": "76649729",
    "name": "Lamar Alexander",
    "username": "SenAlexander",
    "owners": [],
    "note": "no longer a senator"
}\n`);

stderr.log(`Errors start here`);


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


stderr.log(`Errors end here (if there is nothing in between, you are all clear!)\n`);
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






