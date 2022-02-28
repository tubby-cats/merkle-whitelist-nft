const wl = require('./wl.json')

let t = 0;
const adds={}
for(w of wl){
    adds[w.toLowerCase()]=true;
    if(w.endsWith(" ") && adds[w.substring(0, w.length-1).toLowerCase()]===undefined){
        t++;
        console.log(w)
    }
}
console.log(t)
