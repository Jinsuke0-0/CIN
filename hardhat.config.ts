import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

if (!privateKey) {
  console.warn("DEPLOYER_PRIVATE_KEY is not set in .env file. Using a default one for local testing.");
}

const accounts = privateKey ? [privateKey] : ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]; // Default Hardhat private key for local testing

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337, // Default Hardhat Network chain ID
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: accounts,
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: privateKey ? [privateKey] : [],
      chainId: 84532,
    },
  },
};

export default config;
