const hre = require("hardhat");
const ethers = require('ethers')
const fs = require('fs')
const { PromisePool } = require('@supercharge/promise-pool')

async function failedTxsInBlock(blockId) {
    const failed = []
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC)
    const block = await provider.getBlockWithTransactions(blockId)
    for (const tx of block.transactions) {
        if(tx.data !== '0xf8b4d9810000000000000000000000000000000000000000000000000000000000000005'){
            continue;
        }
        if (tx.to === "0xCa7cA7BcC765F77339bE2d648BA53ce9c8a262bD") {
            const txx = await provider.getTransactionReceipt(tx.hash)
            if (txx.status === 1) {
                const gas = (txx.gasUsed * txx.effectiveGasPrice) / 1e18;
                failed.push({
                    tx: txx.transactionHash,
                    gas,
                    from: txx.from,
                })
            }
        }
    }
    console.log(blockId, failed.length)
    return failed
}

async function main() {
    const blocks = []
    for (let blockId = 14263500; blockId < 14263510; blockId++) {
        blocks.push(blockId)
    }
    const { results, errors } = await PromisePool
        .withConcurrency(10)
        .for(blocks)
        .process(failedTxsInBlock)
    fs.writeFileSync('failed_txs.json', JSON.stringify({ results, errors }))
    fs.writeFileSync('failed_txs.csv', results.flat().map(t => [t.from, t.gas, t.tx].join(',')).join('\n'))
}
main()