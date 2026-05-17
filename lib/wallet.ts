import {
  CONFLUX_ESPACE_TESTNET,
  TARGET_CHAIN_ID,
  isTargetChain,
} from "@/lib/chains";

type EthereumProvider = NonNullable<Window["ethereum"]>;

export async function getWalletChainId(
  ethereum: EthereumProvider
): Promise<number> {
  const hex = (await ethereum.request({ method: "eth_chainId" })) as string;
  return parseInt(hex, 16);
}

export async function switchToTargetChain(
  ethereum: EthereumProvider
): Promise<void> {
  const chainIdHex =
    TARGET_CHAIN_ID === CONFLUX_ESPACE_TESTNET.chainId
      ? CONFLUX_ESPACE_TESTNET.chainIdHex
      : `0x${TARGET_CHAIN_ID.toString(16)}`;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code: number }).code
        : null;
    if (code !== 4902) throw err;

    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainIdHex,
          chainName: CONFLUX_ESPACE_TESTNET.name,
          nativeCurrency: CONFLUX_ESPACE_TESTNET.nativeCurrency,
          rpcUrls: [...CONFLUX_ESPACE_TESTNET.rpcUrls],
          blockExplorerUrls: [...CONFLUX_ESPACE_TESTNET.blockExplorerUrls],
        },
      ],
    });
  }

  const after = await getWalletChainId(ethereum);
  if (!isTargetChain(after)) {
    throw new Error(
      `Please switch MetaMask to ${CONFLUX_ESPACE_TESTNET.name} (chain ID ${TARGET_CHAIN_ID}).`
    );
  }
}
