import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-abi-exporter";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";

const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY || "";
// Etherscan or BSCscan API key
const BLOCK_EXPLORER_API_KEY = process.env.BLOCK_EXPLORER_API_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.6",
        settings: {},
      },
    ],
  },
  networks: {
    hardhat: {
      // forking: {
      //   url: "https://bsc-dataseed.binance.org",
      // },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ROPSTEN_PRIVATE_KEY],
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [OWNER_PRIVATE_KEY],
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org",
      chainId: 56,
      accounts: [OWNER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: BLOCK_EXPLORER_API_KEY,
  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
    flat: false,
  },
};

export default config;
