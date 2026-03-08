import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/Logo_Ninelives.png";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      // Not a valid recovery link
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "url('/images/gothic-forest-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.07 }} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsl(220 20% 4%) 100%)" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <img src={logo} alt="Nine Lives" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground">New password</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose a strong password</p>
        </div>

        <div className="border border-border rounded-sm bg-card p-6">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-muted-foreground">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  minLength={6}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gap-2 font-display uppercase tracking-wider" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
