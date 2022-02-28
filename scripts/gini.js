const owners = require('../owners2.json').results

const own = {}
owners.map(o=>{
    if(own[o]===undefined){
        own[o]=1;
    } else {
        own[o]++;
    }
})
console.log(JSON.stringify(Object.values(own)))