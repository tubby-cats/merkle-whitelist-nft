require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    /*
    hardhat: {
      forking: {
        url: process.env.RPC
      }
    },
    */
    mainnet: {
      url: process.env.RPC,
      accounts: [process.env.PRIVATEKEY],
      gasMultiplier: 1.5,
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC,
      accounts: [process.env.PRIVATEKEY]
    },
    polygon: {
      url: process.env.POLYGON_RPC,
      accounts: [process.env.PRIVATEKEY],
      gasMultiplier: 2,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN
  },
};
