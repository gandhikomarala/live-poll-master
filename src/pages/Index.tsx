import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { BarChart3, Users, Shield, Zap, ArrowRight, Check } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Watch votes come in live with instant result updates",
    },
    {
      icon: Shield,
      title: "IP-Based Voting",
      description: "Prevent duplicate votes with intelligent IP tracking",
    },
    {
      icon: Users,
      title: "Admin Controls",
      description: "Full audit log with ability to release IPs and manage votes",
    },
  ];

  const benefits = [
    "One vote per IP per poll",
    "Live result animations",
    "Complete audit trail",
    "Admin IP release",
    "Secure authentication",
    "Mobile responsive",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4" />
              Real-time Live Polling
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-slide-up">
              Create Polls.{" "}
              <span className="gradient-text">Get Instant Results.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              PollMonitor is a powerful real-time polling platform with IP-based vote tracking, 
              live result updates, and comprehensive admin controls.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {user ? (
                <Link to="/polls">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Go to Polls
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              PollMonitor provides all the tools to run secure, real-time polls with complete control.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="poll-card text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary/10 mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                Built for Secure, Fair Polling
              </h2>
              <p className="text-muted-foreground mb-8">
                Whether you're running a public opinion poll, team vote, or any type of survey,
                PollMonitor ensures every vote is tracked, auditable, and fair.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-success/10">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="poll-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="live-badge">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
                    LIVE
                  </span>
                  <span className="text-sm text-muted-foreground">42 votes</span>
                </div>
                <h3 className="font-display font-semibold mb-4">Sample Poll Preview</h3>
                <div className="space-y-3">
                  {[
                    { label: "Option A", percent: 45 },
                    { label: "Option B", percent: 30 },
                    { label: "Option C", percent: 25 },
                  ].map((item, i) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.percent}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={i === 0 ? "result-bar" : "result-bar-secondary"}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to Start Polling?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join PollMonitor today and create your first real-time poll in seconds.
          </p>
          {user ? (
            <Link to="/polls">
              <Button size="lg" variant="secondary" className="gap-2">
                View Polls
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">PollMonitor</span>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Real-time live polling platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
