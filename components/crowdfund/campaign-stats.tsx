"use client";

import { useMemo, useEffect, useState } from "react";
import { ethers } from "ethers";
import { CampaignData } from "@/hooks/use-crowdfund";
import {
  formatCountdown,
  formatDeadlineLocal,
  isDeadlineSuspicious,
  secondsUntilDeadline,
} from "@/lib/campaign-time";
import { Clock, Target, TrendingUp, Users } from "lucide-react";

interface CampaignStatsProps {
  campaign: CampaignData;
}

function useCountdown(deadlineTs: bigint) {
  const invalid = isDeadlineSuspicious(deadlineTs);
  const [remaining, setRemaining] = useState(() =>
    secondsUntilDeadline(deadlineTs)
  );

  useEffect(() => {
    if (invalid) return;
    const tick = () => setRemaining(secondsUntilDeadline(deadlineTs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineTs, invalid]);

  return formatCountdown(remaining, { invalid });
}

export function CampaignStats({ campaign }: CampaignStatsProps) {
  const countdown = useCountdown(campaign.deadline);

  const goalEth = useMemo(
    () => parseFloat(ethers.formatEther(campaign.goal)),
    [campaign.goal]
  );
  const raisedEth = useMemo(
    () => parseFloat(ethers.formatEther(campaign.totalRaised)),
    [campaign.totalRaised]
  );
  const progressPct = useMemo(
    () => Math.min(100, goalEth > 0 ? (raisedEth / goalEth) * 100 : 0),
    [raisedEth, goalEth]
  );

  const deadlineLabel = formatDeadlineLocal(campaign.deadline);
  const badDeadline = isDeadlineSuspicious(campaign.deadline);

  return (
    <div className="space-y-6">
      {badDeadline && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground/90 space-y-1">
          <p className="font-semibold text-destructive">Invalid campaign deadline on-chain</p>
          <p>
            Contract stores deadline{" "}
            <span className="font-mono text-xs">{campaign.deadline.toString()}</span> (Unix
            seconds) — that is year ~5408, not a normal campaign length.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            In Remix, redeploy <code className="text-foreground">SimpleCrowdfund</code> with
            constructor <code className="text-foreground">(_goalInCFX, _durationInMinutes)</code>.
            Example: goal <code className="text-foreground">10</code>, duration{" "}
            <code className="text-foreground">60</code> (60 minutes). Do not use huge numbers for
            duration.
          </p>
        </div>
      )}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Total Raised</p>
            <p className="text-3xl font-bold text-foreground font-mono">
              {raisedEth.toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
              <span className="text-primary text-xl">CFX</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm mb-1">Goal</p>
            <p className="text-xl font-semibold text-muted-foreground font-mono">
              {goalEth.toLocaleString()} CFX
            </p>
          </div>
        </div>

        <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-primary"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground font-mono">
            {progressPct.toFixed(1)}% funded
          </span>
          <span
            className={`text-xs font-semibold ${
              campaign.goalReached ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {campaign.goalReached
              ? "Goal reached!"
              : `${(goalEth - raisedEth).toFixed(4)} CFX to go`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Time left"
          value={countdown}
          sub={
            campaign.isEnded ? "Deadline passed" : `Ends ${deadlineLabel}`
          }
          danger={campaign.isEnded}
        />
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Ends at (local)"
          value={deadlineLabel}
          sub="From contract deadline (UTC → your timezone)"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Progress"
          value={`${progressPct.toFixed(1)}%`}
          highlight={campaign.goalReached}
        />
        <StatCard
          icon={<Users className="w-4 h-4" />}
          label="Status"
          value={
            campaign.isEnded
              ? campaign.goalReached
                ? "Success"
                : "Failed"
              : "Active"
          }
          highlight={campaign.isEnded && campaign.goalReached}
          danger={campaign.isEnded && !campaign.goalReached}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
      <div
        className={`flex items-center gap-1.5 text-xs font-medium ${
          highlight
            ? "text-primary"
            : danger
              ? "text-destructive"
              : "text-muted-foreground"
        }`}
      >
        {icon}
        {label}
      </div>
      <p
        className={`font-semibold font-mono text-sm leading-tight ${
          highlight
            ? "text-primary"
            : danger
              ? "text-destructive"
              : "text-foreground"
        }`}
      >
        {value}
      </p>
      {sub ? (
        <p className="text-[10px] text-muted-foreground leading-snug">{sub}</p>
      ) : null}
    </div>
  );
}
