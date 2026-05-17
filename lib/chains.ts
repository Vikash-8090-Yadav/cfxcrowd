/**
 * Conflux eSpace Testnet — chain ID 71 (0x47).
 * @see https://doc.confluxnetwork.org/docs/espace/network-endpoints
 */
export const CONFLUX_ESPACE_TESTNET = {
  chainId: 71,
  chainIdHex: "0x47",
  name: "Conflux eSpace Testnet",
  nativeCurrency: {
    name: "Conflux",
    symbol: "CFX",
    decimals: 18,
  },
  rpcUrls: ["https://evmtestnet.confluxrpc.com"] as const,
  blockExplorerUrls: ["https://evmtestnet.confluxscan.org"] as const,
} as const;

/** Target chain for this app (defaults to Conflux testnet). */
export const TARGET_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? CONFLUX_ESPACE_TESTNET.chainId
);

export const TARGET_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? CONFLUX_ESPACE_TESTNET.rpcUrls[0];

export const BLOCK_EXPLORER =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER ??
  CONFLUX_ESPACE_TESTNET.blockExplorerUrls[0];

export function explorerAddressUrl(address: string): string {
  return `${BLOCK_EXPLORER}/address/${address}`;
}

export function isTargetChain(chainId: number | null): boolean {
  return chainId === TARGET_CHAIN_ID;
}
