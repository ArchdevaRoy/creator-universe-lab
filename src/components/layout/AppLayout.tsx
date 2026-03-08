import { AppSidebar } from "./AppSidebar";
import { BloodDrip } from "../effects/BloodDrip";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background relative">
      {/* Gothic forest background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/gothic-forest-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.07,
        }}
      />
      {/* Crimson fog overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, hsl(0 80% 20% / 0.12) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 20% 80%, hsl(0 70% 18% / 0.1) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 50%, hsl(0 60% 15% / 0.06) 0%, transparent 70%)",
        }}
      />
      {/* Dark vignette overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, hsl(220 20% 4%) 100%)",
        }}
      />

      <AppSidebar />

      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Blood drips on edges */}
        <BloodDrip />
        <div className="p-4 pt-14 lg:p-8 lg:pt-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
