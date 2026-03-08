import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Creator DNA Blueprint",
      "Limited hook analysis (3/day)",
      "Basic dashboard",
    ],
    cta: "Current Plan",
    active: true,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/month",
    features: [
      "Everything in Free",
      "Unlimited Series Builder",
      "Script-to-Video Studio",
      "Content Calendar",
      "Unlimited Hook Analysis",
    ],
    cta: "Upgrade to Pro",
    active: false,
    highlighted: false,
  },
  {
    name: "Pro Max",
    price: "$20",
    period: "/month",
    features: [
      "Everything in Pro",
      "Full Repurposing Engine",
      "Thumbnail Generator",
      "Export all formats",
      "Priority support",
    ],
    cta: "Upgrade to Pro Max",
    active: false,
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-gradient-punk">Upgrade Your OS</h1>
        <p className="text-sm text-muted-foreground mt-2">Unlock the full creator operating system.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-sm border p-6 space-y-5 transition-all ${
              plan.highlighted
                ? "border-foreground bg-card"
                : "border-border bg-card/50"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                {plan.highlighted && <Crown className="w-4 h-4 text-foreground" />}
                <h2 className="font-display text-lg font-bold text-foreground">{plan.name}</h2>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-bold text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2.5 rounded-sm font-display text-sm font-bold transition-colors ${
                plan.highlighted
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-secondary text-foreground hover:bg-accent"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </motion.div>
  );
}
