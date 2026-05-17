"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import {
  CONFLUX_ESPACE_TESTNET,
  TARGET_CHAIN_ID,
  isTargetChain,
} from "@/lib/chains";
import { getWalletChainId, switchToTargetChain } from "@/lib/wallet";

interface WalletContextType {
  address: string | null;
  chainId: number | null;
  isCorrectChain: boolean;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnecting: boolean;
  isSwitchingChain: boolean;
  connect: () => Promise<void>;
  switchNetwork: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  chainId: null,
  isCorrectChain: false,
  provider: null,
  signer: null,
  isConnecting: false,
  isSwitchingChain: false,
  connect: async () => {},
  switchNetwork: async () => {},
  disconnect: () => {},
  error: null,
});

async function bindWallet(eth: NonNullable<Window["ethereum"]>) {
  const _provider = new BrowserProvider(eth);
  const _signer = await _provider.getSigner();
  const _address = await _signer.getAddress();
  const _chainId = await getWalletChainId(eth);
  return {
    provider: _provider,
    signer: _signer,
    address: _address,
    chainId: _chainId,
  };
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCorrectChain = isTargetChain(chainId);

  const switchNetwork = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("No wallet detected. Install MetaMask or a compatible wallet.");
      return;
    }
    setIsSwitchingChain(true);
    setError(null);
    try {
      await switchToTargetChain(window.ethereum);
      const bound = await bindWallet(window.ethereum);
      setProvider(bound.provider);
      setSigner(bound.signer);
      setAddress(bound.address);
      setChainId(bound.chainId);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to switch network"
      );
    } finally {
      setIsSwitchingChain(false);
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError(
        "No wallet detected. Install MetaMask or a compatible wallet."
      );
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const eth = window.ethereum;
      await eth.request({ method: "eth_requestAccounts" });
      await switchToTargetChain(eth);
      const bound = await bindWallet(eth);
      setProvider(bound.provider);
      setSigner(bound.signer);
      setAddress(bound.address);
      setChainId(bound.chainId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    const eth = window.ethereum;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
        return;
      }
      try {
        const bound = await bindWallet(eth);
        setAddress(bound.address);
        setChainId(bound.chainId);
        setProvider(bound.provider);
        setSigner(bound.signer);
      } catch {
        setSigner(null);
      }
    };

    const handleChainChanged = (hexChainId: string) => {
      const id = parseInt(hexChainId, 16);
      setChainId(id);
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    return () => {
      eth.removeListener("accountsChanged", handleAccountsChanged);
      eth.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        isCorrectChain,
        provider,
        signer,
        isConnecting,
        isSwitchingChain,
        connect,
        switchNetwork,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}

export { CONFLUX_ESPACE_TESTNET, TARGET_CHAIN_ID };
