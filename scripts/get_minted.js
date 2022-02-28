const hre = require("hardhat");
const ethers = require('ethers')
const fs = require('fs')
const wl = require('./wl.json')

async function getLogs(contract, eventFilter, lastBlock){
    const params = {
      fromBlock: 0,
      toBlock: lastBlock
    }
    let logs = [];
    let blockSpread = params.toBlock - params.fromBlock;
    let currentBlock = params.fromBlock;
    while (currentBlock < params.toBlock) {
      const nextBlock = Math.min(params.toBlock, currentBlock + blockSpread);
      try {
        const partLogs = await contract.queryFilter(eventFilter, currentBlock, nextBlock)
        logs = logs.concat(partLogs);
        currentBlock = nextBlock;
        console.log(nextBlock)
      } catch (e) {
        if (blockSpread >= 2e3) {
          // We got too many results
          // We could chop it up into 2K block spreads as that is guaranteed to always return but then we'll have to make a lot of queries (easily >1000), so instead we'll keep dividing the block spread by two until we make it
          blockSpread = Math.floor(blockSpread / 2);
        } else {
          throw e;
        }
      }
    }
    return logs
  }
  

async function main() {
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC)
    const zero = "0x0000000000000000000000000000000000000000"
    const lastBlock = await provider.getBlockNumber()
    const Tubbies = await hre.ethers.getContractFactory("Tubbies");
    const tubbies = await Tubbies.attach("0xca7ca7bcc765f77339be2d648ba53ce9c8a262bd");
    let eventFilter = tubbies.filters.Transfer(zero, null, null)
    let events = await getLogs(tubbies, eventFilter, lastBlock)
    const minters = events.map(e=>"0x"+e.topics[2].substr(26))
    console.log(minters.length)
    fs.writeFileSync('minted2.json', JSON.stringify(minters))
    fs.writeFileSync('minted2.txt', minters.join('\n'))
    
    const minersDict = {}
    minters.map(a=>minersDict[a.toLowerCase()]=true)
    const unminted = []
    wl.map(a=>{
      const aa = a.toLowerCase()
      if(minersDict[aa] === undefined){
        unminted.push(a)
      }
    })
    fs.writeFileSync('unminted.json', JSON.stringify(unminted))
    fs.writeFileSync('unminted.txt', unminted.filter(a => a.length === 42).join('\n'))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
