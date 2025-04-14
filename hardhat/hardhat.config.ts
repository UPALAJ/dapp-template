import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify"

import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env") });

const sepoliaRpc = process.env.NETWORK_RPC;
const yourChainId: any = process.env.CHAIN_ID;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: sepoliaRpc,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    'your-network': {
      url: `${process.env.NETWORK_RPC}`,
      chainId: parseInt(yourChainId),
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  sourcify: {
    enabled: true
  //   // Optional: specify a different Sourcify server
  //   // apiUrl: "https://sourcify.dev/server",
  //   // Optional: specify a different Sourcify repository
  //   // browserUrl: "https://repo.sourcify.dev",
  }
  
};

export default config;
