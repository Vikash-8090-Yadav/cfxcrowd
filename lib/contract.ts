/** Address with no contract deployed — set `NEXT_PUBLIC_CONTRACT_ADDRESS` after deploy. */
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

function isAddressLike(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

/** Remix / deployed SimpleCrowdfund ABI */
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_goalInCFX", type: "uint256" },
      { internalType: "uint256", name: "_durationInMinutes", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "contributions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "creator",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deadline",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "goal",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRaised",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/** Deployed `SimpleCrowdfund` instance — set in `.env.local` as `NEXT_PUBLIC_CONTRACT_ADDRESS`. */
export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string) ?? ZERO_ADDRESS;

/** True when env provides a non-zero 20-byte hex address (your deployed `SimpleCrowdfund`). */
export function isContractConfigured(): boolean {
  return Boolean(
    CONTRACT_ADDRESS &&
      isAddressLike(CONTRACT_ADDRESS) &&
      CONTRACT_ADDRESS.toLowerCase() !== ZERO_ADDRESS
  );
}
