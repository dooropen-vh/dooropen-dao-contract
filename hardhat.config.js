require("@nomiclabs/hardhat-waffle");
require('dotenv').config();


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545"
    },
    rinkeby: {
      chainId: 4,
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.RINKEBY_DEPLOYER_PRIV_KEY]
    },
    mainnet: {
      chainId: 1,
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.MAINNET_DEPLOYER_PRIV_KEY]
    }
  },
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      }
    }
  }
};
