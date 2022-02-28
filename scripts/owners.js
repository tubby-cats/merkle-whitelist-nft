const hre = require("hardhat");
const ethers = require('ethers')
const fs = require('fs')
const { PromisePool } = require('@supercharge/promise-pool')

function getGini(owners) {
    const own = {}
    owners.map(o => {
        if (own[o] === undefined) {
            own[o] = 1;
        } else {
            own[o]++;
        }
    })
    console.log(JSON.stringify(Object.values(own)))
}

async function main() {
    const Tubbies = await hre.ethers.getContractFactory("Tubbies");
    const tubbies = await Tubbies.attach("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d")
    const getOwner = async (id) => {
        console.log(id)
        for (let i = 0; i < 5; i++) {
            try {
                return await tubbies.ownerOf(id)
            } catch (e) { }
        }
        throw new Error(id)
    }
    const data = await PromisePool
        .withConcurrency(10)
        .for([...Array(7779).keys()])
        .process(getOwner)
    fs.writeFileSync('owners-loot.json', JSON.stringify(data))
    getGini(data.results)
}

async function fix() {
    const owners = require('../owners.json')
    const Tubbies = await hre.ethers.getContractFactory("Tubbies");
    const tubbies = await Tubbies.attach("0xCa7cA7BcC765F77339bE2d648BA53ce9c8a262bD")
    const getOwner = async (id) => {
        console.log(id)
        for (let i = 0; i < 5; i++) {
            try {
                return await tubbies.ownerOf(id)
            } catch (e) { }
        }
        throw new Error(id)
    }
    const { results, errors } = await PromisePool
        .withConcurrency(10)
        .for(owners.errors.map(t => t.item))
        .process(getOwner)
    fs.writeFileSync('owners2.json', JSON.stringify({ results: owners.results.concat(results), errors }))
}
main()