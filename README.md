# Moonbox
## Development stacks
* `hardhat` for development ([https://hardhat.org/getting-started/](https://hardhat.org/getting-started/))
* `ethers` for connecting with the network ([https://docs.ethers.io/v5/](https://docs.ethers.io/v5/))
* `waffle` for testing ([https://ethereum-waffle.readthedocs.io/](https://ethereum-waffle.readthedocs.io/))
* `typescript`
* Solidity version `0.7.6`

## Setup and run
Setting up by installing node modules:

```bash
npm install -g yarn
yarn install
```

### Run local ethereum node
Run command below to setup a local node of Ethereum network. More information [here](https://hardhat.org/hardhat-network/).

```bash
yarn node
```

For BSC mainnet fork, run:

```bash
yarn node --fork "https://bsc-dataseed.binance.org"
```
or adding forking config in `hardhat.config.ts`

### Run test
To run all test, use below command:

```
yarn test
```
or run a specific test file:

```
yarn test path/to/test/file
```

**NOTES**:


### Compile
To compile, use below command:

```
yarn compile
```
Hardhat supports multiple compilers adhere to each contract requirements. Check it out at [https://hardhat.org/guides/compile-contracts.html](https://hardhat.org/guides/compile-contracts.html).

### Deploy
Create `.env` file as environment for deployment since we use `dotenv` library.

```
cp .env.sample .env
```

Deploy by running specific deployment script for a specific network:

```
yarn deploy --network ropsten
```

### Verify
Verifying using hardhat is easy with [this guide](https://www.binance.org/en/blog/verify-with-hardhat/).
Add your BSCscan or Etherscan API key as environment variable `BLOCK_EXPLORER_API_KEY`. Then run below command
```
yarn verify --network mainnet <CONTRACT_ADDRESS> "<CONSTRUCTOR_ARGUMENT_1>"
```
This also works on BSC testnet.

### Flatten
Sometimes we want to flatten the contract to manually verify on BSCscan easier. Run below command to flatten a contract:
```
npx hardhat flatten <PATH_TO_CONTRACT> > <PATH_TO_FLATTEN_CONTRACT>
```
This also works on BSC testnet.

## Contracts
### MoonboxNFT contract
This contract uses ERC1155 standard. Basic functions include:
- `setURI` - reset the URI to the NFT JSON data
- `mint` - mint NFT
- `burn` - burn NFT
- `burnBatch` - burn NFT in batches
