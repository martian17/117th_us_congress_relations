//https://en.wikipedia.org/wiki/117th_United_States_Congress
//go to Members section
//first name the tr containing senators to id="112358"
let states = [];
[...document.getElementById("112358").children].slice(0,2).map(td=>{
    let arr = [...td.children];
    let h4;
    let dl;
    for(let elem of arr){
        if(elem.nodeName === "H4"){
            h4 = elem;
        }else if(elem.nodeName === "DL"){
            dl = elem;
            states.push([h4,dl]);
        }
    }
});
let senators = [];
states.map(([h4,dl])=>{
    let state_name = h4.children[0].textContent.trim();
    let state_link = h4.children[0].children[0].getAttribute("href");
    let [sen1,sen2] = [...dl.children].map(dd=>{
        //kinda shaky because text node
        let sen_class = parseInt(dd.childNodes[1].textContent);
        let sen_name = dd.children[1].textContent.trim();
        let sen_wiki = dd.children[1].getAttribute("href");
        let sen_party = dd.childNodes[3].textContent.trim();
        return {
            class:sen_class,
            name:sen_name,
            wiki:sen_wiki,
            party:sen_party,
            state:state_name,
            state_link
        };
    });
    senators.push(sen1);
    senators.push(sen2);
});
console.log("[\n"+senators.map((s)=>{
    return "    "+JSON.stringify(s);
}).join(",\n")+"\n]");