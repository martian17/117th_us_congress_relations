//util functions
let toQueries = function(obj){
    let arr = Object.entries(obj);
    if(arr.length === 0){
        return "";
    }else{
        return "?"+arr.map(([name,value])=>name+"="+value).join("&");
    }
};


let Pause = function(ms){
    return new Promise((res,rej)=>{
        setTimeout(res,ms);
    });
};

//extends the original console to save the stream it was constructed with
class Console extends require("console").Console{
    constructor(stream){
        super(...arguments);
        this.stream=stream;
    }
};
let stderr = new Console(process.stderr);

//returns the values instead of writing it out
class ConsoleReturn extends Console{
    constructor(){
        super(new class extends require("node:stream").Writable{
            write(r){
                that.result = r;
            }
        }());
        let that = this;
    }
    log(){
        super.log(...arguments);
        return this.result;
    }
};

class LogWriter extends Console{
    constructor(stream){
        super(stream);
    }
    log(){
        super.log(...arguments);
        stderr.log(...arguments);
    }
};

class DocGenerator{
    header(cb){
        this.headerSize = cb(()=>1).split("\n").length;
        this.ln = this.headerSize;
        this.headerCallback = cb;
    }
    vals = [];
    ln = 1;//current cursor position
    v(val){//push val to the list
        if(typeof n === "undefined"){
            this.vals.push(this.ln);
        }else{
            this.vals.push(val);
        }
    }
    body = "";
    append(str){
        this.ln += str.split("\n").length-1;
        this.body += str;
    }
    getContents(){
        let str = "";
        //write out header
        let valIndex = 0;
        let that = this;
        str += this.headerCallback((n)=>{
            if(typeof n === "number"){
                return that.vals[n];
            }else{
                return that.vals[valIndex++];
            }
        });
        //write out body
        str += this.body;
        return str;
    }
};


module.exports = {toQueries,Pause,Console,ConsoleReturn,LogWriter,stderr,DocGenerator};