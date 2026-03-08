import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/Logo_Ninelives.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "url('/images/gothic-forest-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.07 }} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsl(220 20% 4%) 100%)" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <img src={logo} alt="Nine Lives" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground">Reset password</h1>
          <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link</p>
        </div>

        <div className="border border-border rounded-sm bg-card p-6">
          {sent ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-foreground">Check your email for a password reset link.</p>
              <Link to="/login">
                <Button variant="outline" className="font-display uppercase tracking-wider">Back to login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2 font-display uppercase tracking-wider" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/login" className="text-foreground hover:underline font-medium">Back to login</Link>
        </p>
      </motion.div>
    </div>
  );
}
