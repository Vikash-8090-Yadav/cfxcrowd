import { JsonRpcProvider } from "ethers";
import { TARGET_RPC_URL } from "@/lib/chains";

let cached: JsonRpcProvider | null = null;

/** Read-only provider — always Conflux eSpace testnet RPC (chain 71). */
export function getReadProvider(): JsonRpcProvider {
  if (!cached) {
    cached = new JsonRpcProvider(TARGET_RPC_URL);
  }
  return cached;
}
