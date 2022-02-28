const hre = require("hardhat");
const { NonceManager } = require("@ethersproject/experimental");
const fs = require('fs')
const unminted = (require('../unminted.json')).filter(a => a.length === 42)

const step = 40;

async function main() {
    const [oldSigner] = await ethers.getSigners();
    const signer = new NonceManager(oldSigner)

    const Tubbies = await hre.ethers.getContractFactory("TubbyWL");
    const tubbies = await Tubbies.attach("0x2eb3495fDF23206aC02e24e5d33db404B3b4B9E0")//.connect(signer);

    const notOwners = []
    for (let i = 0; i < unminted.length; i += step) {
        await Promise.all(unminted.slice(i, i + step).map(async a=>{
            const b = await tubbies.balanceOf(a.toLowerCase())
            if(b.toNumber() === 0){
                notOwners.push(a)
            }
        }))
        console.log(i, notOwners.length, unminted.length)
    }
    fs.writeFileSync("notOwners.json", JSON.stringify(notOwners))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
