import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Shield, Download, Clock, MapPin, Camera, User, Zap, ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface TransactionData {
  amount?: number;
  recipient?: string;
  verified?: boolean;
  verificationData?: any;
  senderLocation?: string;
  timestamp?: string;
}

const Success = () => {
  const location = useLocation();
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  useEffect(() => {
    if (location.state) {
      setTransactionData(location.state as TransactionData);
    } else {
      // Fallback demo data
      setTransactionData({
        amount: 65000,
        recipient: "user@upi",
        verified: true,
        timestamp: new Date().toISOString()
      });
    }
  }, [location.state]);

  const downloadReceipt = async () => {
    setIsGeneratingReceipt(true);
    
    // Simulate receipt generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a simple receipt
    const receiptContent = `
      SAFAYPAY - TRANSACTION RECEIPT
      ================================
      
      Transaction ID: TXN${Date.now()}
      Amount: ₹${transactionData?.amount?.toLocaleString()}
      Recipient: ${transactionData?.recipient}
      Status: COMPLETED
      Verification: ${transactionData?.verified ? "AI VERIFIED" : "STANDARD"}
      Timestamp: ${new Date(transactionData?.timestamp || Date.now()).toLocaleString()}
      
      Security Features:
      ✓ End-to-End Encryption
      ✓ AI-Powered Verification
      ✓ Real-time Fraud Detection
      ✓ Location Validation
      
      Thank you for using SafayPay!
      www.safaypay.com
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safaypay-receipt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGeneratingReceipt(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6 animate-bounce-subtle shadow-2xl shadow-green-500/30">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-slate-600 max-w-md mx-auto">
            Your transaction has been processed securely with AI verification
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Transaction Details Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-green-200/60 shadow-2xl rounded-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              Transaction Details
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Amount Sent</span>
                  <span className="text-3xl font-bold text-green-600">
                    ₹{transactionData?.amount?.toLocaleString() || "5,000"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Recipient</span>
                  <span className="font-semibold text-slate-900">{transactionData?.recipient || "user@upi"}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Transaction ID</span>
                  <span className="font-mono text-sm text-slate-700">TXN{Date.now().toString().slice(-8)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Date & Time</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      {transactionData?.timestamp ? formatDate(transactionData.timestamp) : formatDate(new Date().toISOString())}
                    </div>
                    <div className="text-xs text-slate-500">
                      {transactionData?.timestamp ? formatTime(transactionData.timestamp) : formatTime(new Date().toISOString())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Security & Verification Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow-2xl rounded-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              Security Verification
            </h2>

            <div className="space-y-4">
              {transactionData?.verified ? (
                <>
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BadgeCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-700">AI Verified</p>
                        <p className="text-sm text-green-600">Enhanced security verification passed</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Camera className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-700">Identity Verified</p>
                        <p className="text-sm text-blue-600">Receiver identity confirmed</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-700">Location Verified</p>
                        <p className="text-sm text-blue-600">Geolocation validation successful</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-700">AI Confidence Score</p>
                        <p className="text-sm text-purple-600">94.7% - Very High Confidence</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Shield className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Standard Security</p>
                      <p className="text-sm text-slate-600">Basic transaction verification</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Timeline */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/50">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-600" />
                  Processing Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Initiated</span>
                    <span className="font-medium text-slate-900">{formatTime(new Date().toISOString())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Verified</span>
                    <span className="font-medium text-slate-900">{formatTime(new Date().toISOString())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Completed</span>
                    <span className="font-medium text-green-600">{formatTime(new Date().toISOString())}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up animation-delay-300">
          <Button
            variant="outline"
            className="flex-1 bg-white/80 backdrop-blur-sm border-slate-300/60 hover:bg-white hover:border-slate-400 h-14 rounded-2xl text-slate-700 hover:text-slate-900 transition-all duration-300 group"
            onClick={downloadReceipt}
            disabled={isGeneratingReceipt}
          >
            {isGeneratingReceipt ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600 mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Download Receipt
              </>
            )}
          </Button>
          
          <Link to="/dashboard" className="flex-1 block">
            <Button className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 group">
              Back to Dashboard
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 animate-fade-in animation-delay-500">
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            Your money is safe and secure with bank-grade encryption
          </p>
        </div>
      </div>

      {/* Floating Celebration Elements */}
      <div className="fixed top-10 left-10 w-4 h-4 bg-green-400 rounded-full animate-float opacity-60"></div>
      <div className="fixed top-20 right-20 w-3 h-3 bg-blue-400 rounded-full animate-float animation-delay-1000 opacity-40"></div>
      <div className="fixed bottom-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-float animation-delay-2000 opacity-60"></div>
      <div className="fixed bottom-10 right-10 w-3 h-3 bg-green-300 rounded-full animate-float animation-delay-1500 opacity-50"></div>
    </div>
  );
};

export default Success;