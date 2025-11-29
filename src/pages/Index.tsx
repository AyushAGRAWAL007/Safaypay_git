import { Link } from "react-router-dom";
import { Shield, Zap, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-safaypay.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 opacity-50">
          <img 
            src={heroImage} 
            alt="Secure Payment Platform" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">AI-Powered Scam Protection</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                Confidence
              </span>
              <br />
              in Every Transaction
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              SafayPay uses AI verification and smart limits to protect you from payment scams. 
              Send money with peace of mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-2xl group">
                  Start Protecting Your Money
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-card text-lg px-8 py-6 rounded-2xl">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How SafayPay Protects You</h2>
            <p className="text-muted-foreground text-lg">Advanced AI security meets simple, smart controls</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-primary/20 hover:border-primary/40 transition-colors backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Limits</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set monthly transaction limits. Large payments trigger identity verification before they go through.
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-accent/20 hover:border-accent/40 transition-colors backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Detection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI monitors payment patterns and flags suspicious behavior before money leaves your account.
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-success/20 hover:border-success/40 transition-colors backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success to-success/50 flex items-center justify-center mb-6">
                <Lock className="h-7 w-7 text-success-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Verification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Live photo verification and location checks ensure the recipient is who they claim to be.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Payment Flow</h2>
            
            <div className="space-y-8">
              {[
                { step: "1", title: "Set Your Limit", desc: "Choose a monthly transaction threshold that works for you" },
                { step: "2", title: "Make a Payment", desc: "Send money just like any UPI app" },
                { step: "3", title: "AI Risk Check", desc: "If the amount exceeds your limit, AI verification kicks in" },
                { step: "4", title: "Verify & Confirm", desc: "Recipient confirms identity, you approve the payment" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/30 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Stop Scams?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of users who trust SafayPay to protect their money
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-2xl">
                Create Your Account
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 SafayPay. Confidence in every transaction.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
