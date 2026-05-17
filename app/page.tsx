import { Header } from "@/components/crowdfund/header";
import { NetworkBanner } from "@/components/crowdfund/network-banner";
import { CrowdfundApp } from "@/components/crowdfund/crowdfund-app";

export default function Page() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <NetworkBanner />
      <CrowdfundApp />
    </div>
  );
}
