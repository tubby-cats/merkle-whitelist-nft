const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const wl = require('./wl.json')
const fs = require('fs');
const { paddedBuffer } = require('./utils');

async function main() {
    const tree = new MerkleTree(wl.map(paddedBuffer), keccak256, { sort: true })
    const proofs = {}
    for (const address of wl) {
        const leaf = paddedBuffer(address)
        const proof = tree.getHexProof(leaf)
        proofs[address.toLowerCase()]=proof
    }
    fs.writeFileSync("proofs.json", JSON.stringify(proofs))
}

main()
