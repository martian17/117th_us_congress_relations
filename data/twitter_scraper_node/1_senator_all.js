//execute as `node 1_senator_all.js 1_senator_all.json`
//results in 1_senator_all.json

let fs = require("fs");
let {stderr} = require("./utils/util.js");
let {get_all_data} = require("./utils/twitter_api.js");


let main = async function(){
    stderr.log("Requesting data from the US Senate list on twitter");
    stderr.log("Page URL: https://twitter.com/i/lists/63915645?lang=en");
    stderr.log("API URL: https://api.twitter.com/2/lists/63915645/members");
    //api docs link
    //https://developer.twitter.com/en/docs/api-reference-index
    let result = await get_all_data(`/2/lists/63915645/members`);
    //63915645 is the id of US senate list
    //page link: https://twitter.com/i/lists/63915645?lang=en
    stderr.log(`Execution complete, got ${result.length} senator account metadata entries`);
    fs.writeFileSync(
        "./1_senator_all.json",
        //beautify the formatting
        "[\n"+result.map((s)=>{
            return "    "+JSON.stringify(s);
        }).join(",\n")+"\n]\n",
        "utf-8"
    );
    stderr.log("Written the result to 1_senator_all.json");
};

main();