import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7mN_Z_8jnUERNBZdDB4F_maJw-RpDoq0",
  authDomain: "safapay-9e38b.firebaseapp.com",
  projectId: "safapay-9e38b",
  storageBucket: "safapay-9e38b.firebasestorage.app",
  messagingSenderId: "736667224302",
  appId: "1:736667224302:web:4ebdd56c60bb4c2606cbff",
  measurementId: "G-JT1WSMLGZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login user
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
      } else {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name
        if (name && userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: name
          });
        }

        toast({
          title: "Account created!",
          description: "Welcome to SafaPay!",
        });
      }

      // Navigate to dashboard on success
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error: any) {
      console.error("Authentication error:", error);
      
      let errorMessage = "An unexpected error occurred";
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later";
          break;
        default:
          errorMessage = error.message || "Authentication failed";
      }

      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      <Card className="w-full max-w-md p-8 relative z-10 bg-card/80 backdrop-blur-sm border-primary/20">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent transition-transform group-hover:scale-105">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SafaPay
          </span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Login to protect your payments" : "Start securing your transactions"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border/50 focus:border-primary"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border/50 focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-border/50 focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isLogin ? "Logging in..." : "Creating account..."}
              </div>
            ) : (
              isLogin ? "Login" : "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-primary font-medium">
              {isLogin ? "Sign up" : "Login"}
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;