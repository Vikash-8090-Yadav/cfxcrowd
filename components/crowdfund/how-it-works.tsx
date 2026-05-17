export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Contribute",
      desc: "Send CFX before the deadline. Any amount above zero is accepted.",
    },
    {
      num: "02",
      title: "Wait for deadline",
      desc: "The campaign runs until the set deadline. Track the countdown in real time.",
    },
    {
      num: "03",
      title: "Goal reached → Withdraw",
      desc: "If the goal is met, the creator withdraws all raised funds.",
    },
    {
      num: "04",
      title: "Goal missed → Refund",
      desc: "If the goal is not reached, contributors can claim a full refund.",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        How It Works
      </h3>
      <ol className="space-y-4">
        {steps.map((s) => (
          <li key={s.num} className="flex gap-3">
            <span className="font-mono text-xs text-primary font-bold w-6 pt-0.5 flex-shrink-0">
              {s.num}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
