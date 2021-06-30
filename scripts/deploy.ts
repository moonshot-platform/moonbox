import { ethers, network } from "hardhat";

const main = async () => {
  console.log("Deploying contracts to", network.name);

  const MoonboxNFT = await ethers.getContractFactory("MoonboxNFT");
  const moonboxNFT = await MoonboxNFT.deploy();

  console.log(
    `MoonboxNFT deployed at ${moonboxNFT.address} with tx ${moonboxNFT.deployTransaction.hash}`
  );
  await moonboxNFT.deployed();
  console.log("Deployment finished!");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
