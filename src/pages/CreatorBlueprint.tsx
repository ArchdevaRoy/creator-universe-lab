import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

const archetypes = [
  "Visionary", "Analyst", "Entertainer", "Educator",
  "Contrarian", "Luxury Curator", "Storyteller", "Provocateur",
];

const vibes = [
  "Dark", "Cinematic", "Energetic", "Minimal",
  "Intellectual", "Chaotic", "Raw", "Polished",
];

const goals = [
  "Growth", "Authority", "Monetization", "Personal Brand",
];

const frequencies = [
  "Daily", "3-5x/week", "2-3x/week", "Weekly",
];

interface WizardData {
  niche: string;
  audience: string;
  goal: string;
  frequency: string;
  cameraComfort: number;
  archetype: string;
  vibe: string;
}

const steps = ["Niche", "Audience", "Goal", "Frequency", "Personality", "Vibe", "Blueprint"];

export default function CreatorBlueprint() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    niche: "",
    audience: "",
    goal: "",
    frequency: "",
    cameraComfort: 3,
    archetype: "",
    vibe: "",
  });

  const canNext = () => {
    switch (step) {
      case 0: return data.niche.length > 0;
      case 1: return data.audience.length > 0;
      case 2: return data.goal.length > 0;
      case 3: return data.frequency.length > 0;
      case 4: return data.archetype.length > 0;
      case 5: return data.vibe.length > 0;
      default: return true;
    }
  };

  const isComplete = step === 6;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div
              className={`h-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-foreground w-8" : "bg-border w-6"
              }`}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <StepWrapper title="What's your niche?" sub="The topic space you'll own.">
              <input
                value={data.niche}
                onChange={(e) => setData({ ...data, niche: e.target.value })}
                placeholder="e.g., AI productivity, street photography, startup growth..."
                className="w-full bg-card border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
              />
            </StepWrapper>
          )}

          {step === 1 && (
            <StepWrapper title="Who's your audience?" sub="Describe the people you want to reach.">
              <textarea
                value={data.audience}
                onChange={(e) => setData({ ...data, audience: e.target.value })}
                rows={3}
                placeholder="e.g., Gen Z entrepreneurs, aspiring filmmakers, tech-savvy freelancers..."
                className="w-full bg-card border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none"
              />
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper title="What's your primary goal?" sub="Pick the one that matters most right now.">
              <div className="grid grid-cols-2 gap-2">
                {goals.map((g) => (
                  <button
                    key={g}
                    onClick={() => setData({ ...data, goal: g })}
                    className={`px-4 py-3 rounded-sm border text-sm text-left transition-all ${
                      data.goal === g
                        ? "border-foreground bg-accent text-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper title="How often will you post?" sub="Be realistic — consistency beats frequency.">
              <div className="grid grid-cols-2 gap-2">
                {frequencies.map((f) => (
                  <button
                    key={f}
                    onClick={() => setData({ ...data, frequency: f })}
                    className={`px-4 py-3 rounded-sm border text-sm text-left transition-all ${
                      data.frequency === f
                        ? "border-foreground bg-accent text-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <label className="text-xs text-muted-foreground block mb-2">
                  Camera comfort: {data.cameraComfort}/5
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={data.cameraComfort}
                  onChange={(e) => setData({ ...data, cameraComfort: Number(e.target.value) })}
                  className="w-full accent-foreground"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Shy</span>
                  <span>Natural</span>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper title="Pick your archetype." sub="This shapes your AI-generated voice and strategy.">
              <div className="grid grid-cols-2 gap-2">
                {archetypes.map((a) => (
                  <button
                    key={a}
                    onClick={() => setData({ ...data, archetype: a })}
                    className={`px-4 py-3 rounded-sm border text-sm text-left transition-all ${
                      data.archetype === a
                        ? "border-foreground bg-accent text-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 5 && (
            <StepWrapper title="What's your vibe?" sub="This defines your visual and tonal direction.">
              <div className="grid grid-cols-2 gap-2">
                {vibes.map((v) => (
                  <button
                    key={v}
                    onClick={() => setData({ ...data, vibe: v })}
                    className={`px-4 py-3 rounded-sm border text-sm text-left transition-all ${
                      data.vibe === v
                        ? "border-foreground bg-accent text-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-foreground" />
                <h1 className="text-xl font-display font-bold text-foreground">Your Creator Blueprint</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect AI to generate your full brand strategy. Here's your input summary:
              </p>

              <div className="space-y-3">
                {[
                  ["Niche", data.niche],
                  ["Audience", data.audience],
                  ["Goal", data.goal],
                  ["Frequency", data.frequency],
                  ["Camera Comfort", `${data.cameraComfort}/5`],
                  ["Archetype", data.archetype],
                  ["Vibe", data.vibe],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
                    <span className="text-sm text-foreground font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-6">
                {["Brand Positioning", "Content Pillars", "Hook Style", "Visual Direction", "Tone & Voice", "Differentiation"].map((section) => (
                  <div key={section} className="bg-card border border-border rounded-sm p-4">
                    <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">{section}</h3>
                    <div className="h-16 flex items-center justify-center border border-dashed border-border rounded-sm">
                      <span className="text-xs text-muted-foreground">Connect AI to generate</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 bg-foreground text-background font-display text-sm font-bold rounded-sm hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Blueprint with AI
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!isComplete && (
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 text-sm bg-foreground text-background px-5 py-2 rounded-sm font-medium hover:bg-foreground/90 disabled:opacity-30 transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function StepWrapper({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{sub}</p>
      </div>
      {children}
    </div>
  );
}
