const minters = require('../minted2.json').reduce((all, addy)=>{
    all[addy.toLowerCase()]=true
    return all
}, {})
const fs = require('fs')

const columnWithAddress = {
    1: 3,
    2: 1,
    3: 1,
}

for(const i of [1,2,3]){
    const column = columnWithAddress[i]
    const csv = fs.readFileSync(`./csvs/${i}.csv`).toString().split("\n")
    const filteredCsv = csv.filter(row=>{
        const address = row.split(',')[column].toLowerCase()
        return minters[address] === undefined
    })
    fs.writeFileSync(`./csvs/${i}-filtered.csv`, filteredCsv.join('\n'))
    console.log(i, csv.length, filteredCsv.length)
}