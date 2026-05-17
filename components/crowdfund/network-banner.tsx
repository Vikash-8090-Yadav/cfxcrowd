"use client";

import { useWallet, TARGET_CHAIN_ID } from "@/lib/wallet-context";
import { CONFLUX_ESPACE_TESTNET } from "@/lib/chains";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

export function NetworkBanner() {
  const { address, isCorrectChain, isSwitchingChain, switchNetwork, error } =
    useWallet();

  if (!address || isCorrectChain) return null;

  return (
    <div className="bg-destructive/15 border-b border-destructive/30">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-foreground/90">
              Wrong network. Switch to{" "}
              <span className="font-semibold">{CONFLUX_ESPACE_TESTNET.name}</span>{" "}
              (chain ID {TARGET_CHAIN_ID}) to interact with the contract.
              {error ? (
                <span className="block text-destructive text-xs mt-1">{error}</span>
              ) : null}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={switchNetwork}
            disabled={isSwitchingChain}
            className="border-destructive/40 shrink-0"
          >
            {isSwitchingChain ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Switching…
              </>
            ) : (
              `Switch to ${CONFLUX_ESPACE_TESTNET.name}`
            )}
          </Button>
        </div>
      </div>
  );
}
