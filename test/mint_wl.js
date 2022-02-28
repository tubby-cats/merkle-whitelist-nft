const { ethers } = require("hardhat");
const addy = "0x70F491bdEAFE8D1c0859B5402d95ea11921d0255"
const wl = require('../scripts/wl.json')
const {buildTreeAndProof} = require('../scripts/utils')

describe("wl", function () {
    it("wl works", async function () {
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [addy],
          });
          const minter = await ethers.provider.getSigner(
            addy
          );

          const tubbies = new ethers.Contract(
            "0xca7ca7bcc765f77339be2d648ba53ce9c8a262bd",
            ['function mint(bytes32[] calldata _merkleProof) payable'],
            minter
          )
          const {proof} = buildTreeAndProof(wl, addy)
          console.log(proof.join(','))
          await tubbies.mint(proof, {
            value: ethers.utils.parseEther("0.1"),
          })
    })
})