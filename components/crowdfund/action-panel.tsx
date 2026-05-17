"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CampaignData } from "@/hooks/use-crowdfund";
import { useWallet } from "@/lib/wallet-context";
import { ArrowDownLeft, Loader2, TriangleAlert } from "lucide-react";

interface ActionPanelProps {
  campaign: CampaignData;
  txPending: boolean;
  txError: string | null;
  txSuccess: string | null;
  onContribute: (amount: string) => Promise<void>;
  onWithdraw: () => Promise<void>;
  onRefund: () => Promise<void>;
}

export function ActionPanel({
  campaign,
  txPending,
  txError,
  txSuccess,
  onContribute,
  onWithdraw,
  onRefund,
}: ActionPanelProps) {
  const { address, connect, isCorrectChain, switchNetwork, isSwitchingChain } =
    useWallet();
  const [amount, setAmount] = useState("");

  const isCreator =
    address && campaign.creator.toLowerCase() === address.toLowerCase();

  const myContribEth = parseFloat(ethers.formatEther(campaign.myContribution));

  const handleContribute = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    await onContribute(amount);
    setAmount("");
  };

  if (!address) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ArrowDownLeft className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Connect to participate</p>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to contribute, withdraw, or claim a refund.
          </p>
        </div>
        <Button onClick={connect} className="bg-primary text-primary-foreground font-semibold w-full">
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (!isCorrectChain) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4 text-center">
        <TriangleAlert className="w-10 h-10 text-destructive" />
        <div>
          <p className="font-semibold text-foreground mb-1">Wrong network</p>
          <p className="text-sm text-muted-foreground">
            Switch to Conflux eSpace Testnet (chain ID 71) to send transactions.
          </p>
        </div>
        <Button
          onClick={switchNetwork}
          disabled={isSwitchingChain}
          className="w-full bg-primary text-primary-foreground font-semibold"
        >
          {isSwitchingChain ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Switch network"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <h2 className="font-semibold text-foreground text-lg">Actions</h2>

      {/* My contribution info */}
      {myContribEth > 0 && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-4 py-3">
          <span className="text-sm text-muted-foreground">My contribution</span>
          <span className="font-mono font-semibold text-primary text-sm">
            {myContribEth.toFixed(6)} CFX
          </span>
        </div>
      )}

      {/* Contribute form — only when active */}
      {!campaign.isEnded && (
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground font-medium" htmlFor="amount">
            Contribution amount (CFX)
          </label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={txPending}
              className="font-mono bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleContribute}
              disabled={txPending || !amount || parseFloat(amount) <= 0}
              className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 min-w-[110px]"
            >
              {txPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Contribute"
              )}
            </Button>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2">
            {["0.1", "0.5", "1", "5"].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors font-mono"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Creator withdraw — after deadline & goal reached */}
      {campaign.isEnded && campaign.goalReached && isCreator && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The campaign succeeded. You can now withdraw all raised funds.
          </p>
          <Button
            onClick={onWithdraw}
            disabled={txPending}
            className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
          >
            {txPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Withdraw Funds"}
          </Button>
        </div>
      )}

      {/* Contributor refund — after deadline & goal NOT reached */}
      {campaign.isEnded && !campaign.goalReached && myContribEth > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The campaign did not reach its goal. You can claim a full refund of your{" "}
            <span className="text-foreground font-semibold font-mono">
              {myContribEth.toFixed(6)} CFX
            </span>
            .
          </p>
          <Button
            onClick={onRefund}
            disabled={txPending}
            variant="outline"
            className="w-full border-primary/40 text-primary hover:bg-primary/10 font-semibold"
          >
            {txPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim Refund"}
          </Button>
        </div>
      )}

      {/* Campaign ended — no action available */}
      {campaign.isEnded && !campaign.goalReached && myContribEth === 0 && !isCreator && (
        <p className="text-sm text-muted-foreground text-center py-2">
          This campaign has ended with no goal reached and you have no contribution to refund.
        </p>
      )}

      {campaign.isEnded && campaign.goalReached && !isCreator && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Campaign succeeded! Only the creator can withdraw the funds.
        </p>
      )}

      {/* Tx feedback */}
      {txError && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <TriangleAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="break-all">{txError}</span>
        </div>
      )}
      {txSuccess && (
        <div className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg p-3">
          {txSuccess}
        </div>
      )}
    </div>
  );
}
