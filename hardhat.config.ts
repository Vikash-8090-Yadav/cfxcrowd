import "dotenv/config";
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const deployerKey = process.env.DEPLOYER_PRIVATE_KEY?.startsWith("0x")
  ? process.env.DEPLOYER_PRIVATE_KEY
  : process.env.DEPLOYER_PRIVATE_KEY
    ? `0x${process.env.DEPLOYER_PRIVATE_KEY}`
    : undefined;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    /** Local Anvil / Hardhat node: `npx hardhat node` then deploy with `--network localhost` */
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    /**
     * Conflux eSpace mainnet — override RPC if needed.
     * @see https://doc.confluxnetwork.org/docs/espace
     */
    confluxESpace: {
      url: process.env.CONFLUX_ESPACE_RPC_URL ?? "https://evm.confluxrpc.com",
      chainId: 1030,
      accounts: deployerKey ? [deployerKey] : [],
    },
    /**
     * Conflux eSpace testnet — confirm chain ID / RPC in official docs.
     */
    confluxESpaceTestnet: {
      url:
        process.env.CONFLUX_ESPACE_TESTNET_RPC_URL ??
        "https://evmtestnet.confluxrpc.com",
      chainId: 71,
      accounts: deployerKey ? [deployerKey] : [],
    },
  },
};

export default config;
