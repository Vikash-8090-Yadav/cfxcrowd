"use client";

import { CONTRACT_ADDRESS } from "@/lib/contract";
import { CampaignData } from "@/hooks/use-crowdfund";
import {
  formatDeadlineLocal,
  isDeadlineSuspicious,
} from "@/lib/campaign-time";
import {
  BLOCK_EXPLORER,
  CONFLUX_ESPACE_TESTNET,
  explorerAddressUrl,
} from "@/lib/chains";
import { ExternalLink, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";

interface ContractInfoProps {
  campaign: CampaignData;
}

export function ContractInfo({ campaign }: ContractInfoProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const short = (addr: string) => `${addr.slice(0, 8)}…${addr.slice(-6)}`;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Contract Info
      </h3>

      <InfoRow label="Contract">
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs text-foreground">
            {short(CONTRACT_ADDRESS)}
          </span>
          <button
            onClick={copy}
            className="text-muted-foreground hover:text-foreground transition-colors ml-1"
            aria-label="Copy contract address"
          >
            {copied ? (
              <CheckCheck className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <a
            href={explorerAddressUrl(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="View on ConfluxScan"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </InfoRow>

      <InfoRow label="Creator">
        <a
          href={explorerAddressUrl(campaign.creator)}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-foreground hover:text-primary transition-colors"
        >
          {short(campaign.creator)}
        </a>
      </InfoRow>

      <InfoRow label="Network">
        <span className="text-xs text-foreground">
          {CONFLUX_ESPACE_TESTNET.name}
        </span>
      </InfoRow>

      <InfoRow label="Chain ID">
        <span className="font-mono text-xs text-foreground">
          {CONFLUX_ESPACE_TESTNET.chainId}
        </span>
      </InfoRow>

      <InfoRow label="Token">
        <span className="text-xs font-semibold text-primary">CFX</span>
      </InfoRow>

      <InfoRow label="Deadline (on-chain)">
        <span className="font-mono text-[10px] text-foreground text-right max-w-[180px] break-all">
          {campaign.deadline.toString()}
        </span>
      </InfoRow>

      <InfoRow label="Ends at (local)">
        <span
          className={`text-xs text-right ${
            isDeadlineSuspicious(campaign.deadline)
              ? "text-destructive"
              : "text-foreground"
          }`}
        >
          {formatDeadlineLocal(campaign.deadline)}
        </span>
      </InfoRow>

      <p className="text-[10px] text-muted-foreground pt-1 border-t border-border">
        Explorer: {BLOCK_EXPLORER.replace("https://", "")}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
