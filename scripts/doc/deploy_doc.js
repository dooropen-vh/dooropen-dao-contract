const { ethers } = require("hardhat");
const save = require("../save_deployed");
const { printGasUsedOfUnits } = require("../log_tx");


require("dotenv").config();

async function deployMain(defaultSender) {
  const DOC = await ethers.getContractFactory("DOC");

  let deployInfo = {name:'DOC', address:''};

  const doc = await DOC.deploy("DOC", "DOC", "1.0");
  let tx = await doc.deployed();
  console.log("DOC:", doc.address);

  deployInfo.address = doc.address;
  
  if(deployInfo.address != null && deployInfo.address.length > 0  ){
    save(process.env.NETWORK, deployInfo);
  }

  printGasUsedOfUnits('DOC  Deploy',tx);

  return null;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address, process.env.NETWORK);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  contracts = await deployMain(deployer);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
