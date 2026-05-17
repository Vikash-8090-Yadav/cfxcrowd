"use client";

import { useWallet, TARGET_CHAIN_ID } from "@/lib/wallet-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, LogOut, Loader2 } from "lucide-react";

export function Header() {
  const {
    address,
    isConnecting,
    isCorrectChain,
    chainId,
    connect,
    disconnect,
    error,
  } = useWallet();

  const short = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null;

  return (
    <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
            <span className="font-mono font-bold text-lg text-foreground tracking-tight truncate">
              CFXCrowd
            </span>
            <Badge
              variant="outline"
              className="w-fit text-[10px] px-1.5 py-0 h-5 border-primary/40 text-primary font-mono"
            >
              Testnet · {TARGET_CHAIN_ID}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {address && !isCorrectChain && chainId != null && (
            <Badge
              variant="destructive"
              className="hidden sm:inline-flex text-xs"
            >
              Wrong chain ({chainId})
            </Badge>
          )}
          {address ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-sm font-mono text-muted-foreground">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCorrectChain
                      ? "bg-primary animate-pulse"
                      : "bg-destructive"
                  }`}
                />
                {short}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnect}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Disconnect wallet"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={connect}
              disabled={isConnecting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting…
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          )}
        </div>
      </div>
      {error && !address && (
        <p className="max-w-5xl mx-auto px-4 pb-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </header>
  );
}
