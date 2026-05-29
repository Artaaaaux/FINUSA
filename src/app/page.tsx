import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FinaInsightCard } from "@/components/home/FinaInsightCard";
import { HeroSection } from "@/components/home/HeroSection";
import { HotNewsSection } from "@/components/home/HotNewsSection";
import { QuickFeatureAccess } from "@/components/home/QuickFeatureAccess";
import { RupiahSnapshot } from "@/components/home/RupiahSnapshot";

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <HeroSection />
        <div id="dashboard-sections" className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="min-w-0 space-y-5 lg:col-span-2 lg:space-y-6">
            <div className="animate-fade-in-up stagger-1">
              <HotNewsSection />
            </div>
            <div className="animate-fade-in-up stagger-2">
              <QuickFeatureAccess />
            </div>
          </div>
          <div className="min-w-0 space-y-5 lg:space-y-6">
            <div className="animate-fade-in-up stagger-3">
              <RupiahSnapshot />
            </div>
            <div className="animate-fade-in-up stagger-4">
              <FinaInsightCard />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
