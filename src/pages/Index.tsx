import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Navbar } from "@/components/Navbar";
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

const features = [
  {
    icon: Brain,
    title: "AI Sentiment Analysis",
    description: "Advanced NLP analyzes your journal entries to understand emotional patterns and provide meaningful insights.",
  },
  {
    icon: LineChart,
    title: "Mood Tracking",
    description: "Visual dashboards show your emotional trends over time, helping you identify patterns and triggers.",
  },
  {
    icon: Heart,
    title: "Personalized Support",
    description: "Receive empathetic, AI-generated suggestions tailored to your unique mental wellness journey.",
  },
  {
    icon: BookOpen,
    title: "Reflective Journaling",
    description: "Express your thoughts freely in a safe, private space designed to promote self-reflection.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your data is encrypted and protected. We prioritize your privacy above everything else.",
  },
  {
    icon: Sparkles,
    title: "Wellness Resources",
    description: "Access curated self-care tips, breathing exercises, and mental health resources when you need them.",
  },
];

const benefits = [
  "Track mood patterns with easy emoji-based logging",
  "Get AI-powered insights without clinical diagnosis",
  "Access 24/7 supportive resources and suggestions",
  "Monitor progress with beautiful visualizations",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />
        
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Mental Wellness</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your companion for{" "}
              <span className="text-primary">mindful</span>{" "}
              mental wellness
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Track your mood, journal your thoughts, and receive personalized AI insights 
              to support your mental well-being journey — all in a safe, private space.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Learn More
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
              Everything you need for mental wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed with care to support your emotional health journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
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
                Support your mental health with AI that cares
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI analyzes your patterns compassionately, never replacing professional 
                care but complementing your wellness routine with meaningful insights.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/30 rounded-3xl blur-3xl" />
              <div className="relative bg-card border border-border/50 rounded-3xl p-8 shadow-elevated">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">😊</div>
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">Feeling Good</p>
                    <p className="text-sm text-muted-foreground">Your mood is trending upward this week</p>
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
                Ready to start your wellness journey?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join thousands of users who are taking control of their mental health 
                with AI-powered insights and support.
              </p>
              <Link to="/dashboard">
                <Button 
                  size="xl" 
                  className="bg-background text-foreground hover:bg-background/90 shadow-elevated"
                >
                  Get Started Free
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
              Not a replacement for professional mental health care. 
              If you're in crisis, please seek immediate help.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
