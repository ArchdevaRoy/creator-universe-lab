import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Dna,
  Film,
  PenTool,
  Repeat,
  BarChart3,
  Calendar,
  Star,
  Users,
  Zap,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const heroSlides = [
  {
    image: "/images/hero-slide-1.jpg",
    title: "Unleash Your Creator DNA",
    subtitle: "The dark operating system for content creators who refuse to be ordinary.",
    cta: "Start Building",
    ctaLink: "/dashboard",
  },
  {
    image: "/images/hero-slide-2.jpg",
    title: "Command Your Content Empire",
    subtitle: "AI-powered scripts, hooks, and analytics — all in one gothic workspace.",
    cta: "Explore Tools",
    ctaLink: "/dashboard",
  },
  {
    image: "/images/hero-slide-3.jpg",
    title: "From Script to Screen",
    subtitle: "Write, analyze, repurpose, and dominate every platform with Nine Lives.",
    cta: "Get Started Free",
    ctaLink: "/pricing",
  },
];

const featuredCreators = [
  { id: "creator1", name: "NovaShadow", handle: "@novashadow", avatar: "https://i.pravatar.cc/150?img=11", followers: "142K", niche: "Dark Fantasy" },
  { id: "creator2", name: "CrimsonVeil", handle: "@crimsonveil", avatar: "https://i.pravatar.cc/150?img=32", followers: "89K", niche: "Horror" },
  { id: "creator3", name: "ByteWraith", handle: "@bytewraith", avatar: "https://i.pravatar.cc/150?img=45", followers: "231K", niche: "Tech" },
  { id: "creator4", name: "LunaHex", handle: "@lunahex", avatar: "https://i.pravatar.cc/150?img=26", followers: "67K", niche: "Art" },
  { id: "creator5", name: "VoidCaster", handle: "@voidcaster", avatar: "https://i.pravatar.cc/150?img=53", followers: "198K", niche: "Gaming" },
  { id: "creator6", name: "EmberFrost", handle: "@emberfrost", avatar: "https://i.pravatar.cc/150?img=19", followers: "115K", niche: "Music" },
];

const tools = [
  { icon: Dna, label: "Creator Blueprint", desc: "Define your brand DNA and content pillars", link: "/blueprint" },
  { icon: Film, label: "Series Builder", desc: "Plan structured episodic content", link: "/series" },
  { icon: PenTool, label: "Script Studio", desc: "AI-powered visual script breakdowns", link: "/script" },
  { icon: BarChart3, label: "Hook Analyzer", desc: "Score and optimize your hooks", link: "/analyzer" },
  { icon: Repeat, label: "Repurpose Lab", desc: "Turn one piece into multi-platform gold", link: "/repurpose" },
  { icon: Calendar, label: "Content Calendar", desc: "Strategic content scheduling", link: "/calendar" },
];

const stats = [
  { value: "10K+", label: "Creators" },
  { value: "1M+", label: "Scripts Generated" },
  { value: "500K+", label: "Hooks Analyzed" },
  { value: "99%", label: "Uptime" },
];

const testimonials = [
  { name: "DarkMuse", avatar: "https://i.pravatar.cc/150?img=36", quote: "Nine Lives turned my chaotic ideas into a content machine. The hook analyzer alone tripled my engagement.", rating: 5 },
  { name: "PixelPhantom", avatar: "https://i.pravatar.cc/150?img=48", quote: "The gothic aesthetic matches my brand perfectly. Finally a creator tool that doesn't feel corporate.", rating: 5 },
  { name: "ShadowScript", avatar: "https://i.pravatar.cc/150?img=22", quote: "Series Builder is insane. I planned 3 months of content in one afternoon. This is the future.", rating: 5 },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="space-y-0">
      {/* ── Hero Slider ── */}
      <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden -mx-4 -mt-14 lg:-mx-8 lg:-mt-8" style={{ width: "calc(100% + 2rem)", marginLeft: "-1rem" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroSlides[currentSlide].image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-end pb-16 px-6 lg:px-12">
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 font-body max-w-lg">
              {heroSlides[currentSlide].subtitle}
            </p>
            <Link to={heroSlides[currentSlide].ctaLink}>
              <Button className="gap-2 text-sm font-display uppercase tracking-wider">
                {heroSlides[currentSlide].cta}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-6 right-6 lg:right-12 z-10 flex items-center gap-3">
          <button onClick={prevSlide} className="p-2 rounded-full border border-border bg-card/60 backdrop-blur-sm text-foreground hover:bg-card transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-primary w-6" : "bg-muted-foreground/40"}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="p-2 rounded-full border border-border bg-card/60 backdrop-blur-sm text-foreground hover:bg-card transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-10 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tools Grid ── */}
      <section className="py-14">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground mb-2">
            The Arsenal
          </h2>
          <p className="text-2xl font-display font-bold text-foreground mb-8">
            Everything you need to dominate content.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={tool.link}
                className="group block border border-border rounded-sm p-6 bg-card hover:border-muted-foreground/30 transition-all duration-200"
              >
                <tool.icon className="w-6 h-6 text-foreground mb-4" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{tool.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Launch</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Creators ── */}
      <section className="py-14 border-t border-border">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Featured Creators
              </h2>
              <p className="text-2xl font-display font-bold text-foreground">
                Powered by Nine Lives.
              </p>
            </div>
            <Link to="/feed" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCreators.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/profile/${creator.id}`}
                className="group block border border-border rounded-sm p-4 bg-card hover:border-muted-foreground/30 transition-all text-center"
              >
                <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-border group-hover:ring-foreground/40 transition-all">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="bg-muted text-foreground">{creator.name[0]}</AvatarFallback>
                </Avatar>
                <h4 className="font-display text-xs font-bold text-foreground truncate">{creator.name}</h4>
                <p className="text-[10px] text-muted-foreground">{creator.handle}</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{creator.followers}</span>
                </div>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-muted text-foreground font-medium">
                  {creator.niche}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14 border-t border-border">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground mb-2">
            What Creators Say
          </h2>
          <p className="text-2xl font-display font-bold text-foreground mb-8">
            Built by creators, for creators.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border border-border rounded-sm p-6 bg-card"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5 font-body">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="bg-muted text-foreground text-xs">{t.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-display font-bold text-foreground">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 border-t border-border text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Zap className="w-8 h-8 text-foreground mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Ready to unleash your nine lives?
          </h2>
          <p className="text-muted-foreground font-body max-w-md mx-auto mb-8">
            Join thousands of creators who chose the dark side of content creation.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button className="gap-2 font-display uppercase tracking-wider">
                Enter Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="gap-2 font-display uppercase tracking-wider">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
