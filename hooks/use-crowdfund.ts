"use client";

import { useCallback, useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  isContractConfigured,
} from "@/lib/contract";
import { getReadProvider } from "@/lib/provider";
import { useWallet } from "@/lib/wallet-context";

export interface CampaignData {
  creator: string;
  goal: bigint;
  deadline: bigint;
  totalRaised: bigint;
  myContribution: bigint;
  isEnded: boolean;
  goalReached: boolean;
}

export function useCrowdfund() {
  const { signer, address, isCorrectChain } = useWallet();
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [txPending, setTxPending] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);

  const fetchCampaign = useCallback(async () => {
    if (!isContractConfigured()) {
      setCampaign(null);
      setFetchError(null);
      return;
    }

    setLoading(true);
    setFetchError(null);
    try {
      const readProvider = getReadProvider();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);
      const [creator, goal, deadline, totalRaised] = await Promise.all([
        contract.creator(),
        contract.goal(),
        contract.deadline(),
        contract.totalRaised(),
      ]);

      let myContribution = 0n;
      if (address) {
        myContribution = await contract.contributions(address);
      }

      // Use latest block time so "ended" matches the contract (block.timestamp)
      const block = await readProvider.getBlock("latest");
      const chainNow = BigInt(block?.timestamp ?? Math.floor(Date.now() / 1000));
      const isEnded = chainNow >= deadline;
      const goalReached = totalRaised >= goal;

      setCampaign({
        creator,
        goal,
        deadline,
        totalRaised,
        myContribution,
        isEnded,
        goalReached,
      });
    } catch (err) {
      console.error("fetchCampaign error:", err);
      setFetchError(
        err instanceof Error ? err.message : "Failed to load campaign data"
      );
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchCampaign();
    const interval = setInterval(fetchCampaign, 15000);
    return () => clearInterval(interval);
  }, [fetchCampaign]);

  const requireSigner = () => {
    if (!signer) throw new Error("Connect your wallet first.");
    if (!isCorrectChain) {
      throw new Error("Switch to Conflux eSpace Testnet (chain ID 71).");
    }
  };

  const contribute = useCallback(
    async (amountInCFX: string) => {
      if (!isContractConfigured()) return;
      setTxPending(true);
      setTxError(null);
      setTxSuccess(null);
      try {
        requireSigner();
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer!);
        const tx = await contract.contribute({
          value: ethers.parseEther(amountInCFX),
        });
        await tx.wait();
        setTxSuccess(`Successfully contributed ${amountInCFX} CFX!`);
        await fetchCampaign();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Transaction failed";
        setTxError(
          msg.includes("user rejected") ? "Transaction rejected by user." : msg
        );
      } finally {
        setTxPending(false);
      }
    },
    [signer, isCorrectChain, fetchCampaign]
  );

  const withdraw = useCallback(async () => {
    if (!isContractConfigured()) return;
    setTxPending(true);
    setTxError(null);
    setTxSuccess(null);
    try {
      requireSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer!);
      const tx = await contract.withdraw();
      await tx.wait();
      setTxSuccess("Funds withdrawn successfully!");
      await fetchCampaign();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setTxError(
        msg.includes("user rejected") ? "Transaction rejected by user." : msg
      );
    } finally {
      setTxPending(false);
    }
  }, [signer, isCorrectChain, fetchCampaign]);

  const refund = useCallback(async () => {
    if (!isContractConfigured()) return;
    setTxPending(true);
    setTxError(null);
    setTxSuccess(null);
    try {
      requireSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer!);
      const tx = await contract.refund();
      await tx.wait();
      setTxSuccess("Refund received successfully!");
      await fetchCampaign();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setTxError(
        msg.includes("user rejected") ? "Transaction rejected by user." : msg
      );
    } finally {
      setTxPending(false);
    }
  }, [signer, isCorrectChain, fetchCampaign]);

  return {
    campaign,
    loading,
    fetchError,
    contractConfigured: isContractConfigured(),
    txPending,
    txError,
    txSuccess,
    contribute,
    withdraw,
    refund,
    refetch: fetchCampaign,
  };
}
