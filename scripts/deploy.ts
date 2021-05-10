import { ethers } from "hardhat";
import { Contract, utils, providers, constants, BigNumber } from ethers;

const main = async () => {
  const Moonbox = await ethers.getContractFactory("Moonbox");
  const moonbox = await Moonbox.deploy();
  const MoonboxNFT = await ethers.getContractFactory("MoonboxNFT");
  const moonboxNFT = await MoonboxNFT.deploy();

  await moonbox.deployed();
  await moonboxNFT.deployed();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
