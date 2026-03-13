import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet, Flame, DollarSign, TrendingUp, ArrowUpRight,
  History, Trophy, BarChart3, CreditCard, Loader2, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const KARMA_TO_DOLLAR = 1000;

function formatKarma(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function karmaToCash(karma: number) {
  return (karma / KARMA_TO_DOLLAR).toFixed(2);
}

export default function WalletPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "leaderboard" | "analytics">("overview");
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [connectingStripe, setConnectingStripe] = useState(false);

  const fetchWallet = async () => {
    if (!user) return;

    const { data: w } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!w) {
      // Create wallet
      const { data: newW } = await supabase
        .from("wallets")
        .insert({ user_id: user.id })
        .select()
        .single();
      setWallet(newW);
    } else {
      setWallet(w);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setTransactions(data || []);
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("karma_leaderboard" as any)
      .select("*")
      .limit(20);
    setLeaderboard(data || []);
  };

  const fetchPayouts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("payout_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setPayouts(data || []);
  };

  const checkStripeStatus = async () => {
    const { data, error } = await supabase.functions.invoke("wallet-payout", {
      body: { action: "check_stripe_status" },
    });
    if (!error && data) setStripeConnected(data.connected);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchWallet(), fetchTransactions(), fetchLeaderboard(), fetchPayouts(), checkStripeStatus()]);
      setLoading(false);
    };
    init();
  }, [user]);

  const handleConnectStripe = async () => {
    setConnectingStripe(true);
    const { data, error } = await supabase.functions.invoke("wallet-payout", {
      body: { action: "setup_stripe_connect" },
    });
    if (error || data?.error) {
      toast({ title: "Error", description: data?.error || error?.message, variant: "destructive" });
    } else if (data?.url) {
      window.open(data.url, "_blank");
    }
    setConnectingStripe(false);
  };

  const handleRequestPayout = async () => {
    const amount = parseInt(payoutAmount);
    if (!amount || amount < 1000) {
      toast({ title: "Minimum 1,000 karma", description: "That's $1.00 minimum payout.", variant: "destructive" });
      return;
    }
    setRequesting(true);
    const { data, error } = await supabase.functions.invoke("wallet-payout", {
      body: { action: "request_payout", karma_amount: amount },
    });
    if (error || data?.error) {
      toast({ title: "Payout failed", description: data?.error || error?.message, variant: "destructive" });
    } else {
      toast({ title: "Payout requested! 🎉", description: `$${karmaToCash(amount)} will be sent to your account.` });
      setPayoutAmount("");
      await Promise.all([fetchWallet(), fetchTransactions(), fetchPayouts()]);
    }
    setRequesting(false);
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Wallet },
    { id: "history" as const, label: "History", icon: History },
    { id: "leaderboard" as const, label: "Leaderboard", icon: Trophy },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient-punk flex items-center gap-2">
          <Wallet className="w-7 h-7" /> Creator Wallet
        </h1>
        <p className="text-muted-foreground mt-1 font-body text-sm">
          Track karma earnings and request cash payouts. 1,000 karma = $1.00
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Karma Balance</p>
                <p className="text-2xl font-display font-bold mt-1">{formatKarma(wallet?.karma_balance || 0)}</p>
              </div>
              <Flame className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cash Value</p>
                <p className="text-2xl font-display font-bold mt-1 text-green-400">${karmaToCash(wallet?.karma_balance || 0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lifetime Karma</p>
                <p className="text-2xl font-display font-bold mt-1">{formatKarma(wallet?.karma_lifetime || 0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground/40" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Paid Out</p>
                <p className="text-2xl font-display font-bold mt-1">${Number(wallet?.total_paid_out || 0).toFixed(2)}</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-muted-foreground/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stripe Connect + Payout */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            {!stripeConnected ? (
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Connect Stripe to receive payouts</p>
                  <p className="text-xs text-muted-foreground">Set up your payout account to withdraw earnings</p>
                </div>
                <Button size="sm" onClick={handleConnectStripe} disabled={connectingStripe} className="gap-1.5">
                  {connectingStripe ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                  Connect Stripe
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400/30 text-[10px]">
                    ✓ Stripe Connected
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Input
                    type="number"
                    placeholder="Karma amount (min 1000)"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="h-9 text-sm max-w-[200px]"
                    min={1000}
                    max={wallet?.karma_balance || 0}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    = ${karmaToCash(parseInt(payoutAmount) || 0)}
                  </span>
                  <Button size="sm" onClick={handleRequestPayout} disabled={requesting} className="gap-1.5">
                    {requesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3 h-3" />}
                    Request Payout
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="glow-line w-full" />

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-sm p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
              activeTab === tab.id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <h2 className="text-sm font-display font-semibold">Recent Payouts</h2>
          {payouts.length > 0 ? (
            <div className="space-y-2">
              {payouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-card border border-border rounded-sm px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{formatKarma(p.karma_amount)} karma → ${Number(p.cash_amount).toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={p.status === "completed" ? "default" : p.status === "pending" ? "secondary" : "destructive"} className="text-[10px] capitalize">
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">No payout requests yet.</p>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-2">
          {transactions.length > 0 ? (
            transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between bg-card border border-border rounded-sm px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                    t.karma_amount > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {t.karma_amount > 0 ? <Flame className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.description || t.type.replace(/_/g, " ")}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-display font-bold ${t.karma_amount > 0 ? "text-primary" : "text-muted-foreground"}`}>
                    {t.karma_amount > 0 ? "+" : ""}{t.karma_amount}
                  </p>
                  {Number(t.cash_amount) > 0 && (
                    <p className="text-[10px] text-green-400">${Number(t.cash_amount).toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">No transactions yet. Earn karma by publishing content!</p>
          )}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="space-y-2">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry: any, i: number) => (
              <div key={entry.user_id} className="flex items-center gap-3 bg-card border border-border rounded-sm px-4 py-3">
                <span className={`font-display font-bold text-lg w-8 text-center ${
                  i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
                  {entry.avatar_url ? (
                    <img src={entry.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                  ) : (
                    (entry.display_name || "?")[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.display_name || "Creator"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-bold text-primary">{formatKarma(entry.karma_lifetime)}</p>
                  <p className="text-[10px] text-muted-foreground">lifetime karma</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">No creators on the leaderboard yet.</p>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Earning Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display font-bold">
                {transactions.filter((t) => t.karma_amount > 0).length > 0
                  ? formatKarma(Math.round(
                      (wallet?.karma_lifetime || 0) / Math.max(1, transactions.filter((t) => t.karma_amount > 0).length)
                    ))
                  : "0"
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">avg karma per event</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Payout Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display font-bold">{payouts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {payouts.filter((p) => p.status === "completed").length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Karma Earned (Recent)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-16">
                {Array.from({ length: 7 }).map((_, i) => {
                  const dayTransactions = transactions.filter((t) => {
                    const d = new Date(t.created_at);
                    const now = new Date();
                    const dayDiff = Math.floor((now.getTime() - d.getTime()) / 86400000);
                    return dayDiff === (6 - i) && t.karma_amount > 0;
                  });
                  const total = dayTransactions.reduce((s, t) => s + t.karma_amount, 0);
                  const max = Math.max(1, ...transactions.filter((t) => t.karma_amount > 0).map((t) => t.karma_amount));
                  const height = Math.max(4, (total / max) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary/30 rounded-sm transition-all"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[8px] text-muted-foreground">
                        {["M", "T", "W", "T", "F", "S", "S"][i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display font-bold">
                {wallet?.karma_lifetime
                  ? `${((Number(wallet.total_paid_out) / (wallet.karma_lifetime / KARMA_TO_DOLLAR)) * 100 || 0).toFixed(0)}%`
                  : "0%"
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">karma converted to cash</p>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
