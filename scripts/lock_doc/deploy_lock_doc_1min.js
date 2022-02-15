const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const utils = ethers.utils;
const save = require("../save_deployed");
const { printGasUsedOfUnits } = require("../log_tx");

const {
  toBN,
  keccak256,
} = require("web3-utils");

require("dotenv").config();

const loadDeployed = require("../load_deployed");

const zeroAddress = "0x0000000000000000000000000000000000000000";
const doctoken = loadDeployed(process.env.NETWORK, "DOC");

async function deployMain(defaultSender) {
  const [deployer, user1] = await ethers.getSigners();

  const DOC_Address = doctoken;
  const doc = await ethers.getContractAt("IDOC", DOC_Address);
  console.log("doc:", doc.address);

  const LockDOC = await ethers.getContractFactory("LockDOC");
  const LockDOCProxy = await ethers.getContractFactory(
    "LockDOCProxy"
  );


  let deployInfo = {name:'', address:''};
  const lockDOC = await LockDOC.deploy();
  let tx = await lockDOC.deployed();
  console.log("LockDOC:", lockDOC.address);
  deployInfo = {
    name: "LockDOC1Min",
    address: lockDOC.address
  }
  if(deployInfo.address != null && deployInfo.address.length > 0  ){
    save(process.env.NETWORK, deployInfo);
  }

  printGasUsedOfUnits('LockDOC  Deploy',tx);

  const lockDOCProxy = await LockDOCProxy.deploy(lockDOC.address, deployer.address);
  tx =  await lockDOCProxy.deployed();
  console.log("LockDOCProxy:", lockDOCProxy.address);
  deployInfo = {
    name: "LockDOC1MinProxy",
    address: lockDOCProxy.address
  }

  if(deployInfo.address != null && deployInfo.address.length > 0  ){
    save(process.env.NETWORK, deployInfo);
  }

  printGasUsedOfUnits('LockDOCProxy Deploy',tx);

  const min = 60;
  const week = 86400 * 7;
  
  tx = await lockDOCProxy.initialize(DOC_Address, min, week);

  printGasUsedOfUnits('LockDOCProxy Deploy',tx);

  const docAddress = await lockDOCProxy.doc();
  console.log("LockDOCProxy Initialized:", docAddress !== 0);

  return null;
}

async function main() {
  const [deployer, user1] = await ethers.getSigners();
  const users = await ethers.getSigners();
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
