const proofs = require('../proofs.json')

let t = 0;
for(p of Object.values(proofs)){
    for(pp of p){
    if(pp.length !== 66){
        t++;
        console.log(pp)
    }
}
}
console.log(t)