import { useState } from "react";
import { motion } from "framer-motion";
import { Repeat, FileText, Video, Mic, Twitter, Linkedin, Mail, Instagram } from "lucide-react";

const tabs = [
  { id: "shorts", label: "Short-Form Scripts", icon: Video },
  { id: "carousel", label: "IG Carousel", icon: Instagram },
  { id: "thread", label: "X Thread", icon: Twitter },
  { id: "linkedin", label: "LinkedIn Post", icon: Linkedin },
  { id: "newsletter", label: "Newsletter", icon: Mail },
];

export default function RepurposeLab() {
  const [activeTab, setActiveTab] = useState("shorts");
  const [input, setInput] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Repurpose Lab</h1>
        <p className="text-sm text-muted-foreground mt-1">Turn one piece of content into multi-platform assets.</p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="flex gap-2">
          {["Video Script", "Blog Post", "Podcast Transcript"].map((type) => (
            <button
              key={type}
              className="text-xs px-3 py-1.5 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
            >
              {type}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder="Paste your long-form content here..."
          className="w-full bg-card border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none"
        />
        <button className="flex items-center gap-2 text-sm bg-foreground text-background px-5 py-2.5 rounded-sm font-medium hover:bg-foreground/90 transition-colors">
          <Repeat className="w-4 h-4" /> Repurpose with AI
        </button>
      </div>

      <div className="glow-line w-full" />

      {/* Output tabs */}
      <div>
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 border border-dashed border-border rounded-sm p-12 flex flex-col items-center justify-center">
          <FileText className="w-6 h-6 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground text-center">
            Paste content above and click "Repurpose with AI"<br />to generate multi-platform outputs.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
