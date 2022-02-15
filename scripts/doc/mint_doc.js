const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const loadDeployed = require("../load_deployed");

require("dotenv").config();

const doctoken = loadDeployed(process.env.NETWORK, "DOC");

async function main() {
  const [deployer, user1] = await ethers.getSigners();
  const users = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());


  const DOC = await ethers.getContractAt("DOC", doctoken);

  const tx = await DOC.mint(
      deployer.address,
      ethers.utils.parseUnits(process.env.DOC_MINT_AMOUNT, 18)
    );

  console.log("doc.mint tx ", tx.hash );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
