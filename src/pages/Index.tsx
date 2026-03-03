import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Navbar } from "@/components/Navbar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { useParallax } from "@/hooks/useParallax";
import { 
  Brain, 
  Heart, 
  LineChart, 
  Shield, 
  Sparkles, 
  BookOpen,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Index() {
  const { scrollY, getParallaxStyle } = useParallax();
  const { t } = useTranslation();

  const features = [
    { icon: Brain, title: t("home.features.aiAnalysis"), description: t("home.features.aiAnalysisDesc") },
    { icon: LineChart, title: t("home.features.moodTracking"), description: t("home.features.moodTrackingDesc") },
    { icon: Heart, title: t("home.features.personalizedSupport"), description: t("home.features.personalizedSupportDesc") },
    { icon: BookOpen, title: t("home.features.journaling"), description: t("home.features.journalingDesc") },
    { icon: Shield, title: t("home.features.privacy"), description: t("home.features.privacyDesc") },
    { icon: Sparkles, title: t("home.features.resources"), description: t("home.features.resourcesDesc") },
  ];

  const benefits = [
    t("home.benefits.b1"),
    t("home.benefits.b2"),
    t("home.benefits.b3"),
    t("home.benefits.b4"),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ParallaxBackground variant="hero" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />
        
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div
            className="mx-auto max-w-3xl text-center animate-fade-up"
            style={{ transform: `translateY(${scrollY * -0.15}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("home.badge")}</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {t("home.title")}{" "}
              <span className="text-primary">{t("home.titleHighlight")}</span>{" "}
              {t("home.titleEnd")}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              {t("home.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                  {t("home.cta")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                {t("home.learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("home.featuresTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.featuresSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t("home.benefits.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("home.benefits.subtitle")}
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative" style={{ transform: `translateY(${Math.max(0, (scrollY - 400)) * -0.08}px)` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/30 rounded-3xl blur-3xl" />
              <div className="relative bg-card border border-border/50 rounded-3xl p-8 shadow-elevated">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">😊</div>
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">{t("home.feelingGood")}</p>
                    <p className="text-sm text-muted-foreground">{t("home.moodTrending")}</p>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-t from-primary/10 to-transparent rounded-xl flex items-end justify-around px-4 pb-2">
                  {[3, 4, 3, 5, 4, 4, 5].map((h, i) => (
                    <div
                      key={i}
                      className="w-6 bg-primary/60 rounded-t-lg transition-all"
                      style={{ height: `${h * 20}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl gradient-accent p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                {t("home.ctaTitle")}
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                {t("home.ctaSubtitle")}
              </p>
              <Link to="/dashboard">
                <Button 
                  size="xl" 
                  className="bg-background text-foreground hover:bg-background/90 shadow-elevated"
                >
                  {t("home.ctaButton")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="gradient-accent p-2 rounded-xl">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-semibold text-foreground">MindfulAI</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              {t("home.footer")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
