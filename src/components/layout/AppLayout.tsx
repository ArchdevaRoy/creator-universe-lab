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
      {/* Dark vignette overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, hsl(220 20% 4%) 100%)",
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
