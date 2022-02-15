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
const proxyAddress = loadDeployed(process.env.NETWORK, "LockDOCProxy");

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
    name: "LockDOC",
    address: lockDOC.address
  }
  if(deployInfo.address != null && deployInfo.address.length > 0  ){
    save(process.env.NETWORK, deployInfo);
  }

  printGasUsedOfUnits('LockDOC  Deploy',tx);

  const lockDOCProxy = await LockDOCProxy.attach(proxyAddress);
  
  tx = await lockDOCProxy.upgradeTo(lockDOC.address);

  printGasUsedOfUnits('LockDOCProxy upgradeTo',tx);

  console.log("LockDOCProxy Upgrade to:", lockDOC.address);

  return null;
}

async function main() {
  const [deployer, user1] = await ethers.getSigners();
  const users = await ethers.getSigners();
  console.log("Upgrading contracts with the account:", deployer.address, process.env.NETWORK);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  contracts = await deployMain(deployer);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
