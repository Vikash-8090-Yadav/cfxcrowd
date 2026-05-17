"use client";

import { useCrowdfund } from "@/hooks/use-crowdfund";
import { CampaignStats } from "./campaign-stats";
import { ActionPanel } from "./action-panel";
import { ContractInfo } from "./contract-info";
import { HowItWorks } from "./how-it-works";
import { CONFLUX_ESPACE_TESTNET, TARGET_CHAIN_ID } from "@/lib/chains";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import { Loader2, RefreshCw } from "lucide-react";

export function CrowdfundApp() {
  const {
    campaign,
    loading,
    fetchError,
    contractConfigured,
    txPending,
    txError,
    txSuccess,
    contribute,
    withdraw,
    refund,
    refetch,
  } = useCrowdfund();

  if (!contractConfigured) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 max-w-xl mx-auto">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">
            Deploy contract on Conflux testnet
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Deploy <code className="text-xs bg-muted px-1.5 py-0.5 rounded">SimpleCrowdfund</code> to{" "}
            <span className="text-primary font-medium">
              {CONFLUX_ESPACE_TESTNET.name}
            </span>{" "}
            (chain ID {TARGET_CHAIN_ID}), then add the address below.
          </p>
        </div>

        <div className="w-full rounded-xl border border-border bg-card p-5 space-y-4 text-sm">
          <div>
            <p className="font-medium text-foreground mb-2">1. Deploy with Hardhat</p>
            <pre className="text-xs font-mono bg-muted rounded-lg p-3 overflow-x-auto text-foreground/90">
{`npm run deploy:espace-testnet`}
            </pre>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">2. Configure frontend (`.env.local`)</p>
            <pre className="text-xs font-mono bg-muted rounded-lg p-3 overflow-x-auto text-foreground/90 whitespace-pre-wrap break-all">
{`NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddress
NEXT_PUBLIC_CHAIN_ID=71
NEXT_PUBLIC_RPC_URL=https://evmtestnet.confluxrpc.com`}
            </pre>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">3. Run app</p>
            <pre className="text-xs font-mono bg-muted rounded-lg p-3 text-foreground/90">
              npm run dev
            </pre>
          </div>
        </div>
      </main>
    );
  }

  if (loading && !campaign) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Loading campaign from chain {TARGET_CHAIN_ID}…</p>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center max-w-md">
        <p className="text-muted-foreground text-sm">
          {fetchError ??
            "Unable to load campaign. Check the contract address and RPC."}
        </p>
        <button
          onClick={refetch}
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try again
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance leading-tight">
            Community Campaign
          </h1>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Crowdfunding on{" "}
            <span className="text-primary font-semibold">
              {CONFLUX_ESPACE_TESTNET.name}
            </span>{" "}
            · chain ID {TARGET_CHAIN_ID}
          </p>
          <p className="text-[11px] font-mono text-muted-foreground mt-2 break-all">
            Connected: {CONTRACT_ADDRESS}
          </p>
        </div>
        <button
          onClick={refetch}
          aria-label="Refresh"
          className="flex-shrink-0 mt-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <CampaignStats campaign={campaign} />

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <ActionPanel
          campaign={campaign}
          txPending={txPending}
          txError={txError}
          txSuccess={txSuccess}
          onContribute={contribute}
          onWithdraw={withdraw}
          onRefund={refund}
        />
        <div className="space-y-4">
          <ContractInfo campaign={campaign} />
          <HowItWorks />
        </div>
      </div>
    </main>
  );
}
