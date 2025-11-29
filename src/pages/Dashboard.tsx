import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Shield, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Settings, 
  LogOut,
  CreditCard,
  BarChart3,
  Bell,
  User,
  HelpCircle,
  Zap,
  Camera,
  MapPin,
  Contact,
  ShieldCheck,
  TrendingUp,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactionLimit, setTransactionLimit] = useState([65000]);
  const [isInteracting, setIsInteracting] = useState(false);
  const currentBalance = 125000;
  const userName = "John Smith";
  const accountNumber = "XXXX XXXX 4827";

  // Performance optimized transactions with useMemo
  const recentTransactions = useMemo(() => [
    { 
      id: 1, 
      type: "sent", 
      amount: 12500, 
      recipient: "TechCorp Solutions", 
      category: "Business Payment",
      status: "verified", 
      time: "2 hours ago",
      requiresVerification: true,
      verified: true
    },
    { 
      id: 2, 
      type: "received", 
      amount: 32500, 
      sender: "Global Enterprises Ltd", 
      category: "Invoice Payment",
      status: "completed", 
      time: "5 hours ago",
      requiresVerification: false,
      verified: true
    },
    { 
      id: 3, 
      type: "sent", 
      amount: 4500, 
      recipient: "Prime Utilities", 
      category: "Bill Payment",
      status: "completed", 
      time: "1 day ago",
      requiresVerification: false,
      verified: false
    },
  ], []);

  const securityFeatures = useMemo(() => [
    { name: "AI Fraud Detection", status: "Active", level: "High", icon: ShieldCheck },
    { name: "Photo Verification", status: "Ready", level: "High", icon: Camera },
    { name: "Location Tracking", status: "Active", level: "Medium", icon: MapPin },
    { name: "Behavior Analysis", status: "Monitoring", level: "High", icon: BarChart3 },
  ], []);

  const quickActions = useMemo(() => [
    { label: "Send Money", icon: ArrowUpRight, path: "/transaction", primary: true },
    { label: "View All Transactions", icon: BarChart3, path: "/transactions" },
    { label: "Manage Cards", icon: CreditCard, path: "/cards" },
  ], []);

  // Memoized handlers for better performance
  const handleSendMoney = useCallback(() => {
    navigate("/transaction");
  }, [navigate]);

  const handleViewTransactions = useCallback(() => {
    navigate("/transactions");
  }, [navigate]);

  const handleTransactionClick = useCallback((transactionId) => {
    navigate(`/transaction/${transactionId}`);
  }, [navigate]);

  // Optimized smooth animation handler with reduced layout thrashing
  const handleSmoothInteraction = useCallback((callback) => {
    if (isInteracting) return;
    
    setIsInteracting(true);
    
    // Use double requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        callback();
        // Reset interaction state after animation completes
        setTimeout(() => setIsInteracting(false), 300);
      });
    });
  }, [isInteracting]);

  // Debounced slider handler
  const handleSliderChange = useCallback((value) => {
    handleSmoothInteraction(() => setTransactionLimit(value));
  }, [handleSmoothInteraction]);

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Navbar with optimized animations */}
      <nav className="border-b border-border/40 bg-card/30 backdrop-blur-lg sticky top-0 z-50 transition-all duration-300 ease-out">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 group transition-all duration-300 ease-out hover:scale-105 active:scale-95"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent transition-all duration-300 ease-out group-hover:shadow-lg group-active:scale-95">
              <Shield className="h-6 w-6 text-primary-foreground transition-transform duration-300 ease-out group-hover:rotate-12" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300">
              SafayPay
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:bg-card/50"
            >
              <Bell className="h-5 w-5 transition-transform duration-200 hover:rotate-12" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-border/40">
              <Avatar className="h-8 w-8 border-2 border-primary/20 transition-all duration-300 ease-out hover:scale-110 active:scale-95">
                <AvatarFallback className="bg-primary/10 text-primary font-medium transition-colors duration-200">
                  JS
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium transition-colors duration-200">{userName}</p>
                <p className="text-xs text-muted-foreground transition-colors duration-200">
                  Account: {accountNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:bg-card/50"
              >
                <Settings className="h-5 w-5 transition-transform duration-200 hover:rotate-90" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:bg-card/50"
              >
                <LogOut className="h-5 w-5 transition-transform duration-200 hover:rotate-12" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-all duration-500">
                Welcome back, {userName}!
              </h1>
              <p className="text-muted-foreground transition-colors duration-500">
                Manage your secure payments and spending limits
              </p>
            </div>
            <div className="text-right transition-all duration-500">
              <p className="text-sm text-muted-foreground transition-colors duration-500">Current Balance</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-500">
                ₹{currentBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Limit Card - Optimized animations */}
            <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-primary/20 transition-all duration-500 ease-out hover:shadow-xl hover:border-primary/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 transition-all duration-500">
                  <div className="p-2 rounded-lg bg-primary/20 transition-all duration-500 ease-out hover:scale-110 active:scale-95">
                    <Shield className="h-5 w-5 text-primary transition-transform duration-500 hover:rotate-12" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold transition-colors duration-500">Single Transaction Limit</h2>
                    <p className="text-sm text-muted-foreground transition-colors duration-500">
                      Set maximum amount per transaction
                    </p>
                  </div>
                </div>
                <Badge className="bg-accent/20 text-accent border-accent/30 transition-all duration-500 ease-out hover:scale-105 active:scale-95">
                  <Zap className="h-3 w-3 mr-1 transition-transform duration-500" />
                  AI Protected
                </Badge>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-4 transition-all duration-500">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-500">
                    ₹{transactionLimit[0].toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground transition-colors duration-500">per transaction</span>
                </div>
                
                <Slider
                  value={transactionLimit}
                  onValueChange={handleSliderChange}
                  max={200000}
                  min={10000}
                  step={5000}
                  className="mb-6 transition-all duration-500 ease-out"
                />
                
                {/* Enhanced Security Warning */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 transition-all duration-500 ease-out hover:border-primary/30">
                  <div className="flex items-start gap-3 transition-all duration-500">
                    <AlertTriangle className="h-5 w-5 text-primary mt-0.5 transition-transform duration-500 ease-out hover:rotate-12" />
                    <div>
                      <p className="font-medium text-primary transition-colors duration-500">Enhanced Verification Required</p>
                      <p className="text-sm text-primary/80 mt-1 transition-colors duration-500">
                        Transactions above ₹{transactionLimit[0].toLocaleString()} will require <strong>location verification</strong> and <strong>photo confirmation</strong> for added security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features Grid */}
              <div className="grid grid-cols-2 gap-4 transition-all duration-500">
                <div className="p-3 rounded-lg bg-background/50 border border-primary/20 transition-all duration-300 ease-out hover:border-primary/40 hover:scale-105 active:scale-95">
                  <div className="flex items-center gap-2 transition-all duration-300">
                    <Camera className="h-4 w-4 text-primary transition-transform duration-300 hover:rotate-12" />
                    <span className="text-sm font-medium transition-colors duration-300">Photo Verification</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 transition-colors duration-300">Required above limit</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-accent/20 transition-all duration-300 ease-out hover:border-accent/40 hover:scale-105 active:scale-95">
                  <div className="flex items-center gap-2 transition-all duration-300">
                    <MapPin className="h-4 w-4 text-accent transition-transform duration-300 hover:rotate-12" />
                    <span className="text-sm font-medium transition-colors duration-300">Location Check</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 transition-colors duration-300">Required above limit</p>
                </div>
              </div>
            </Card>

            {/* Recent Transactions - Optimized interactions */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/40 transition-all duration-500 ease-out hover:shadow-lg hover:border-border/60">
              <div className="flex items-center justify-between mb-6 transition-all duration-500">
                <h2 className="text-xl font-bold flex items-center gap-2 transition-colors duration-500">
                  <BarChart3 className="h-5 w-5 text-primary transition-transform duration-500 hover:rotate-12" />
                  Recent Transactions
                </h2>
                <Button 
                  onClick={() => handleSmoothInteraction(handleViewTransactions)}
                  variant="outline" 
                  className="border-border/50 transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-card"
                >
                  View All Transactions
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => handleSmoothInteraction(() => handleTransactionClick(transaction.id))}
                    className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/40 transition-all duration-300 ease-out hover:bg-background/80 hover:border-primary/20 hover:scale-105 active:scale-95 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 transition-all duration-300">
                      <div
                        className={`p-3 rounded-xl transition-all duration-300 ease-out group-hover:scale-110 group-active:scale-95 ${
                          transaction.type === "sent"
                            ? "bg-primary/20 text-primary"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        {transaction.type === "sent" ? (
                          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                        )}
                      </div>
                      <div className="transition-all duration-300">
                        <p className="font-medium transition-colors duration-300">
                          {transaction.type === "sent" ? transaction.recipient : transaction.sender}
                        </p>
                        <p className="text-sm text-muted-foreground transition-colors duration-300">
                          {transaction.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1 transition-all duration-300">
                          <span className="text-xs text-muted-foreground transition-colors duration-300">
                            {transaction.time}
                          </span>
                          {transaction.requiresVerification && (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 transition-all duration-300">
                              <ShieldCheck className="h-3 w-3 mr-1 transition-transform duration-300" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right transition-all duration-300">
                      <p className={`font-bold text-lg transition-colors duration-300 ${
                        transaction.type === "sent" ? "text-primary" : "text-success"
                      }`}>
                        {transaction.type === "sent" ? "-" : "+"}₹{transaction.amount.toLocaleString()}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                        transaction.status === "verified" 
                          ? "bg-success/20 text-success" 
                          : "bg-primary/20 text-primary"
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions - Optimized animations */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20 transition-all duration-500 ease-out hover:shadow-xl hover:border-primary/30">
              <h2 className="text-lg font-bold mb-4 transition-colors duration-500">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSmoothInteraction(() => navigate(action.path))}
                    className={`w-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
                      action.primary 
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white' 
                        : 'border-border/50 hover:bg-card justify-start'
                    }`}
                    variant={action.primary ? "default" : "outline"}
                  >
                    <action.icon className="h-4 w-4 mr-2 transition-transform duration-300 hover:rotate-12" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Quick Transfer */}
              <div className="mt-6 pt-4 border-t border-border/40 transition-all duration-500">
                <h3 className="font-semibold text-sm mb-3 transition-colors duration-500">Quick Transfer</h3>
                <div className="flex gap-2 transition-all duration-500">
                  {[1000, 5000, 10000].map((amount) => (
                    <Button
                      key={amount}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50 transition-all duration-300 ease-out hover:scale-110 active:scale-95 hover:bg-card"
                      onClick={() => handleSmoothInteraction(() => navigate(`/transfer/${amount}`))}
                    >
                      ₹{amount >= 1000 ? `${amount/1000}K` : amount}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Enhanced Security Status */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-success/20 transition-all duration-500 ease-out hover:shadow-lg hover:border-success/30">
              <div className="flex items-center gap-2 mb-4 transition-all duration-500">
                <div className="p-2 rounded-lg bg-success/20 transition-all duration-500 ease-out hover:scale-110 active:scale-95">
                  <ShieldCheck className="h-5 w-5 text-success transition-transform duration-500 hover:rotate-12" />
                </div>
                <div>
                  <h2 className="text-lg font-bold transition-colors duration-500">Security Status</h2>
                  <p className="text-sm text-muted-foreground transition-colors duration-500">
                    AI protection active
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 transition-all duration-500">
                {securityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/40 transition-all duration-300 ease-out hover:border-primary/20 hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center gap-3 transition-all duration-300">
                        <IconComponent className="h-4 w-4 text-primary transition-transform duration-300 hover:rotate-12" />
                        <div>
                          <p className="font-medium text-sm transition-colors duration-300">{feature.name}</p>
                          <p className="text-xs text-muted-foreground transition-colors duration-300">
                            Level: {feature.level}
                          </p>
                        </div>
                      </div>
                      <Badge className={`transition-all duration-300 ease-out ${
                        feature.status === "Active" || feature.status === "Ready" 
                          ? "bg-success/20 text-success border-success/30" 
                          : "bg-primary/20 text-primary border-primary/30"
                      }`}>
                        {feature.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Agentic AI Status */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-primary/20 transition-all duration-500 ease-out hover:shadow-lg hover:border-primary/30">
              <div className="flex items-center gap-2 mb-4 transition-all duration-500">
                <div className="p-2 rounded-lg bg-primary/20 transition-all duration-500 ease-out hover:scale-110 active:scale-95">
                  <Zap className="h-5 w-5 text-primary transition-transform duration-500 hover:rotate-12" />
                </div>
                <div>
                  <h2 className="text-lg font-bold transition-colors duration-500">Agentic AI Ready</h2>
                  <p className="text-sm text-muted-foreground transition-colors duration-500">
                    Automated verification system
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 transition-all duration-500">
                <div className="flex items-center justify-between text-sm transition-all duration-500">
                  <span className="text-muted-foreground transition-colors duration-500">System Status</span>
                  <Badge className="bg-success/20 text-success border-success/30 transition-all duration-500">
                    <CheckCircle2 className="h-3 w-3 mr-1 transition-transform duration-500" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm transition-all duration-500">
                  <span className="text-muted-foreground transition-colors duration-500">Verification Ready</span>
                  <Badge className="bg-success/20 text-success border-success/30 transition-all duration-500">
                    Photo + Location
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm transition-all duration-500">
                  <span className="text-muted-foreground transition-colors duration-500">Response Time</span>
                  <span className="font-medium transition-colors duration-500">&lt; 2s</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;