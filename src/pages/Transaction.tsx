import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, AlertTriangle, MapPin, Camera, User, CheckCircle2, Clock, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Transaction = () => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [senderLocation, setSenderLocation] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [waitingForReceiver, setWaitingForReceiver] = useState(false);
  const [receiverResponse, setReceiverResponse] = useState<any>(null);
  const [verificationStep, setVerificationStep] = useState<"request" | "waiting" | "review" | "complete">("request");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // User's custom transaction limit (from Dashboard settings)
  const transactionLimit = 65000;
  const currentBalance = 125000;

  useEffect(() => {
    if (showVerification && !senderLocation) {
      getSenderLocation();
    }
  }, [showVerification]);

  const getSenderLocation = async () => {
    setIsLoadingLocation(true);
    try {
      if (!navigator.geolocation) {
        setSenderLocation("Location not available");
        setIsLoadingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            if (data.display_name) {
              setSenderLocation(data.display_name);
            } else {
              setSenderLocation(`${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
            }
          } catch (error) {
            setSenderLocation(`${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
          }
          setIsLoadingLocation(false);
        },
        () => {
          setSenderLocation("Location access denied");
          setIsLoadingLocation(false);
        }
      );
    } catch (error) {
      setSenderLocation("Location unavailable");
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessing) {
      console.log("Already processing, ignoring click");
      return;
    }
    
    // Validation
    if (!recipient || recipient.trim() === "") {
      toast({
        title: "Missing recipient",
        description: "Please enter recipient UPI ID or phone number",
        variant: "destructive",
      });
      return;
    }

    if (!amount || amount.trim() === "") {
      toast({
        title: "Missing amount",
        description: "Please enter the amount to send",
        variant: "destructive",
      });
      return;
    }
    
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    if (amountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Amount must be greater than zero",
        variant: "destructive",
      });
      return;
    }

    if (amountNum > currentBalance) {
      toast({
        title: "Insufficient balance",
        description: "Amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Check if amount exceeds user's custom transaction limit
    if (amountNum > transactionLimit) {
      setShowVerification(true);
      setIsProcessing(false);
      toast({
        title: "Verification Required",
        description: `Transaction exceeds your limit of ₹${transactionLimit.toLocaleString()}`,
      });
    } else {
      // Direct payment without verification
      processDirectPayment(amountNum);
    }
  };

  const processDirectPayment = (amountNum: number) => {
    toast({
      title: "Processing Payment",
      description: "Your transaction is being processed...",
    });

    // Simulate API call to backend
    setTimeout(() => {
      navigate("/success", {
        state: {
          amount: amountNum,
          recipient,
          verified: false,
          timestamp: new Date().toISOString(),
          transactionId: `TXN${Date.now()}`
        }
      });
    }, 2000);
  };

  const navigateToReceiverPage = () => {
    // Generate transaction data for receiver
    const transactionData = {
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      amount: parseFloat(amount),
      recipient: recipient,
      securityLimit: transactionLimit,
      requiresReceiverVerification: true,
      sender: "Current User", // In real app, get from auth context
      timestamp: new Date().toISOString()
    };

    // Open receiver page in new tab with transaction data
    const receiverUrl = `/receiver-verification`;
    window.open(receiverUrl, '_blank');
    
    // Also set the transaction data in current tab for simulation
    localStorage.setItem('pendingVerification', JSON.stringify(transactionData));
    
    toast({
      title: "Receiver Page Opened",
      description: "Receiver verification page opened in new tab",
    });

    // Start the verification process in current tab
    sendVerificationRequest(transactionData.transactionId);
  };

  const sendVerificationRequest = async (transactionId?: string) => {
    const txnId = transactionId || `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    setVerificationSent(true);
    setVerificationStep("waiting");
    setWaitingForReceiver(true);

    toast({
      title: "Verification Request Sent",
      description: "Waiting for receiver to submit verification...",
    });

    // Start polling for receiver response
    startPollingForVerification(txnId);
  };

  const startPollingForVerification = (transactionId: string) => {
    const pollInterval = setInterval(() => {
      const verificationData = localStorage.getItem(`verification_${transactionId}`);
      if (verificationData) {
        clearInterval(pollInterval);
        const response = JSON.parse(verificationData);
        handleReceiverResponse(response);
      }
    }, 2000);

    // Clear polling after 2 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (waitingForReceiver) {
        toast({
          title: "Verification Timeout",
          description: "Receiver did not respond in time",
          variant: "destructive",
        });
        setWaitingForReceiver(false);
        setVerificationStep("request");
      }
    }, 120000);
  };

  const handleReceiverResponse = (response: any) => {
    setReceiverResponse(response);
    setWaitingForReceiver(false);
    setVerificationStep("review");

    toast({
      title: "Receiver Verified!",
      description: "Review the verification details to proceed",
    });
  };

  const approveVerification = () => {
    setVerificationStep("complete");
    
    toast({
      title: "Verification Approved",
      description: "Processing secure payment...",
    });

    // Simulate API call to backend
    setTimeout(() => {
      navigate("/success", {
        state: {
          amount: parseFloat(amount),
          recipient,
          verified: true,
          verificationData: receiverResponse,
          senderLocation,
          timestamp: new Date().toISOString(),
          transactionId: receiverResponse.transactionId
        }
      });
    }, 2000);
  };

  const rejectVerification = () => {
    setVerificationSent(false);
    setWaitingForReceiver(false);
    setReceiverResponse(null);
    setVerificationStep("request");

    toast({
      title: "Verification Rejected",
      description: "You can request a new verification",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-green-950 to-blue-900">
      {/* Navbar */}
      <nav className="border-b border-blue-500/30 bg-gradient-to-r from-blue-900/80 to-green-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-blue-500/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-all duration-300 hover:gap-3">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-green-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Shield className="h-5 w-5 text-green-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              SafayPay
            </span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {!showVerification ? (
          <Card className="p-8 bg-gradient-to-br from-blue-900 to-green-900 border-blue-500/30 shadow-2xl shadow-blue-500/20 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-green-600 shadow-lg animate-pulse">
                <Zap className="h-6 w-6 text-green-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-400">
                  Send Money
                </h1>
                <p className="text-green-300/70">
                  Secure UPI payment with AI protection
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-sm font-semibold text-green-300">
                  Recipient UPI ID / Phone
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 group-focus-within:text-green-400 transition-colors duration-300" />
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="user@upi or 9876543210"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="pl-11 bg-blue-950/50 border-blue-500/30 focus:border-green-500 text-lg h-14 rounded-xl transition-all duration-300 text-green-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-semibold text-green-300">
                  Amount (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-blue-400">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-12 bg-gradient-to-r from-blue-950/50 to-green-950/50 border-blue-500/30 focus:border-green-500 text-3xl font-bold h-20 rounded-xl transition-all duration-300 text-green-400"
                  />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/50 to-green-950/50 border border-blue-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-300">Your Transaction Limit</span>
                  <span className="text-xl font-bold text-green-400">
                    ₹{transactionLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-300">Available Balance</span>
                  <span className="text-xl font-bold text-green-400">₹{currentBalance.toLocaleString()}</span>
                </div>
                <div className="mt-3 text-xs text-green-300/70 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Transactions above ₹{transactionLimit.toLocaleString()} require AI verification
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-7 rounded-xl shadow-lg shadow-green-500/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="p-8 bg-gradient-to-br from-blue-900 to-green-900 border-green-500/30 shadow-2xl shadow-green-500/20 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                <AlertTriangle className="h-6 w-6 text-green-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-400">
                  AI Verification Required
                </h2>
                <p className="text-green-300/70">
                  Amount exceeds your safety limit of ₹{transactionLimit.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/50 to-green-950/50 border border-blue-500/30 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-300 mb-1">Amount</p>
                  <p className="text-3xl font-bold text-green-400">
                    ₹{parseFloat(amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-300 mb-1">Recipient</p>
                  <p className="text-lg font-semibold text-green-400">{recipient}</p>
                </div>
              </div>
            </div>

            {/* Sender Location */}
            <div className="p-5 rounded-xl bg-blue-950/50 border border-blue-500/30 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-blue-300 mb-1">Your Location</p>
                  {isLoadingLocation ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <p className="text-sm text-green-300/70">Detecting location...</p>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-400 break-words">
                      {senderLocation || "Fetching..."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Receiver Point of View Button */}
            <div className="mb-6">
              <Button
                variant="outline"
                className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-950/50 hover:text-purple-300 hover:border-purple-400/50 h-12 rounded-xl transition-all duration-300 group hover:scale-[1.02] animate-pulse"
                onClick={navigateToReceiverPage}
              >
                <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Receiver Point of View
                <span className="ml-2 px-2 py-1 text-xs bg-purple-600/30 rounded-full border border-purple-500/50 group-hover:bg-purple-600/50 transition-colors duration-300">
                  Live Demo
                </span>
              </Button>
            </div>

            {/* Verification Flow */}
            {verificationStep === "request" && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-950/50 to-green-950/50 border border-green-500/30">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-400">
                    <Shield className="h-5 w-5" />
                    Agentic AI Verification Process
                  </h3>
                  <ul className="space-y-3 text-sm text-green-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Click "Receiver Point of View" to open verification page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Receiver will submit photo and location verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>AI will analyze authenticity and location accuracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>You'll review the verification before completing payment</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-950/50 h-14 rounded-xl"
                    onClick={() => setShowVerification(false)}
                  >
                    Go Back
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 h-14 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => sendVerificationRequest()}
                    disabled={verificationSent}
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Start Verification
                  </Button>
                </div>
              </div>
            )}

            {verificationStep === "waiting" && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-8 rounded-xl bg-gradient-to-br from-blue-950/50 to-blue-900/50 border border-blue-500/30 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-green-600 mb-4 animate-pulse">
                    <Clock className="h-8 w-8 text-green-300" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Waiting for Receiver</h3>
                  <p className="text-green-300/70 mb-4">
                    {recipient} has been notified to submit verification
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-blue-400 font-medium">Waiting for receiver response...</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-950/50 hover:text-purple-300 hover:border-purple-400/50 h-12 rounded-xl transition-all duration-300 group hover:scale-[1.02] mb-3"
                  onClick={navigateToReceiverPage}
                >
                  <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Open Receiver Page Again
                  <span className="ml-2 px-2 py-1 text-xs bg-purple-600/30 rounded-full border border-purple-500/50 group-hover:bg-purple-600/50 transition-colors duration-300">
                    Demo
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-950/50 h-12 rounded-xl"
                  onClick={() => setShowVerification(false)}
                >
                  Cancel & Go Back
                </Button>
              </div>
            )}

            {verificationStep === "review" && receiverResponse && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 rounded-xl bg-green-950/50 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-green-400">Receiver Verified Successfully</span>
                  </div>
                  <p className="text-sm text-green-300">
                    AI has validated the receiver's identity and location
                  </p>
                </div>

                {/* Photo Preview */}
                <div className="p-5 rounded-xl bg-blue-950/50 border border-blue-500/30">
                  <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-400" />
                    Receiver Verification Photo
                  </h3>
                  <div className="relative bg-gradient-to-br from-blue-900/50 to-green-900/50 rounded-lg overflow-hidden h-64 flex items-center justify-center mb-4 border border-blue-500/20">
                    <img src={receiverResponse.photo.dataUrl} alt="Verification" className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 left-3 right-3 bg-blue-950/90 text-green-300 text-xs py-2 px-3 rounded-lg backdrop-blur-sm border border-blue-500/30">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{receiverResponse.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-blue-900/50 border border-blue-500/20">
                      <p className="text-blue-300 mb-1">AI Confidence</p>
                      <p className="font-bold text-blue-400">{(receiverResponse.aiConfidence * 100).toFixed(0)}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-900/50 border border-green-500/20">
                      <p className="text-green-300 mb-1">Location Accuracy</p>
                      <p className="font-bold text-green-400">{receiverResponse.locationAccuracy}</p>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="p-5 rounded-xl bg-green-950/50 border border-green-500/30">
                  <h3 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-400" />
                    Location Verification
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-300/70">Detected Location</span>
                      <span className="font-medium text-green-400">{receiverResponse.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-300/70">Coordinates</span>
                      <span className="font-mono text-green-400">
                        {receiverResponse.coordinates.lat.toFixed(4)}°, {receiverResponse.coordinates.lng.toFixed(4)}°
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-300/70">Device</span>
                      <span className="font-medium text-green-400">{receiverResponse.deviceInfo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-950/50 h-14 rounded-xl transition-all duration-300"
                    onClick={rejectVerification}
                  >
                    Reject & Request New
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-14 rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]"
                    onClick={approveVerification}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Approve & Pay
                  </Button>
                </div>
              </div>
            )}

            {verificationStep === "complete" && (
              <div className="text-center py-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-700 mb-4 animate-bounce">
                  <CheckCircle2 className="h-10 w-10 text-green-300" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Processing Payment...</h3>
                <p className="text-green-300/70">AI verification complete. Finalizing transaction.</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Transaction;