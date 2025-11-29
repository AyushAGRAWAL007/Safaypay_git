import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, Camera, MapPin, CheckCircle, AlertCircle, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type TransactionData = {
  transactionId?: string;
  verificationId?: string;
  recipient?: string;
  amount?: number;
  securityLimit?: number;
  requiresReceiverVerification?: boolean;
  sender?: string;
};

type PhotoMetadata = {
  timestamp?: string;
  location?: string;
  device?: string;
  coordinates?: { lat: number; lng: number } | null;
};

const ReceiverVerification = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "processing" | "verified" | "failed">("pending");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [receiverLocation, setReceiverLocation] = useState<string>("");
  const [photoMetadata, setPhotoMetadata] = useState<PhotoMetadata | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);

  useEffect(() => {
    // Check for transaction data from various sources
    let transactionDataFromSource: TransactionData | null = null;

    // 1. Check location state (from navigation)
    if (location.state) {
      transactionDataFromSource = location.state as TransactionData;
    } 
    // 2. Check localStorage (from sender page)
    else {
      try {
        const storedData = localStorage.getItem('pendingVerification');
        if (storedData) {
          transactionDataFromSource = JSON.parse(storedData);
        }
      } catch (err) {
        console.warn("Failed to parse localStorage data", err);
      }
    }

    // 3. Check URL parameters as fallback
    if (!transactionDataFromSource) {
      try {
        const qs = new URLSearchParams(location.search || "");
        const tx = qs.get("transactionId") ?? undefined;
        const ver = qs.get("verificationId") ?? undefined;
        const recipient = qs.get("recipient") ?? undefined;
        const amount = qs.get("amount");
        const securityLimit = qs.get("securityLimit");
        
        if (tx || ver || recipient) {
          transactionDataFromSource = {
            transactionId: tx,
            verificationId: ver,
            recipient,
            amount: amount ? Number(amount) : undefined,
            securityLimit: securityLimit ? Number(securityLimit) : undefined,
            requiresReceiverVerification: true,
          };
        }
      } catch (err) {
        console.warn("Failed to parse query params", err);
      }
    }

    if (transactionDataFromSource) {
      setTransactionData(transactionDataFromSource);
    }
  }, [location]);

  useEffect(() => {
    if (!transactionData) return;
    getReceiverLocation();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [transactionData]);

  const getReceiverLocation = async () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const coordStr = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
            setReceiverLocation(coordStr);
            setPhotoMetadata((prev) => ({ ...(prev ?? {}), coordinates: { lat: latitude, lng: longitude } }));
          },
          () => fallbackRandomLocation(),
          { timeout: 5000 }
        );
      } else {
        fallbackRandomLocation();
      }
    } catch {
      fallbackRandomLocation();
    }
  };

  const fallbackRandomLocation = () => {
    const locations = [
      "Bangalore, Karnataka, India", 
      "Mumbai, Maharashtra, India", 
      "Delhi, NCT, India", 
      "Chennai, Tamil Nadu, India",
      "Hyderabad, Telangana, India",
      "Kolkata, West Bengal, India"
    ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setReceiverLocation(randomLocation);
    
    // Generate random coordinates for the selected location
    const locationCoordinates: { [key: string]: { lat: number; lng: number } } = {
      "Bangalore, Karnataka, India": { lat: 12.9716, lng: 77.5946 },
      "Mumbai, Maharashtra, India": { lat: 19.0760, lng: 72.8777 },
      "Delhi, NCT, India": { lat: 28.6139, lng: 77.2090 },
      "Chennai, Tamil Nadu, India": { lat: 13.0827, lng: 80.2707 },
      "Hyderabad, Telangana, India": { lat: 17.3850, lng: 78.4867 },
      "Kolkata, West Bengal, India": { lat: 22.5726, lng: 88.3639 }
    };
    
    setPhotoMetadata((prev) => ({ 
      ...(prev ?? {}), 
      coordinates: locationCoordinates[randomLocation] || { lat: 12.9716, lng: 77.5946 } 
    }));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      toast({
        title: "Camera Started",
        description: "Camera is ready for verification",
      });
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera Access Denied",
        description: "Using mock photo for demonstration",
        variant: "destructive",
      });
      generateMockPhoto();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const video = videoRef.current;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    
    canvasRef.current.width = w;
    canvasRef.current.height = h;
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, w, h);

    // Add timestamp and verification text
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, h - 40, w, 40);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(`Verified: ${new Date().toLocaleString()} | Location: ${receiverLocation}`, 10, h - 20);

    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.8);
    setCapturedPhoto(dataUrl);

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setPhotoMetadata((prev) => ({ 
      ...(prev ?? {}), 
      timestamp: new Date().toISOString(), 
      location: receiverLocation, 
      device: "Mobile Camera", 
      coordinates: prev?.coordinates ?? null 
    }));
    
    setCurrentStep(1);
    toast({ 
      title: "Photo Captured", 
      description: "Photo captured successfully with verification data" 
    });
  };

  const generateMockPhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, "#3b82f6");
    gradient.addColorStop(1, "#10b981");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add user emoji
    ctx.fillStyle = "white";
    ctx.font = "bold 120px Arial";
    ctx.textAlign = "center";
    ctx.fillText("👤", 400, 280);

    // Add verification text
    ctx.font = "bold 28px Arial";
    ctx.fillText("Receiver Verification", 400, 350);

    // Add timestamp and location
    ctx.font = "18px Arial";
    ctx.fillText(`Verified: ${new Date().toLocaleString()}`, 400, 400);
    ctx.fillText(`Location: ${receiverLocation}`, 400, 430);

    // Add security badge
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(300, 460, 200, 60);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px Arial";
    ctx.fillText("🔒 SECURE VERIFICATION", 400, 495);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedPhoto(dataUrl);
    setPhotoMetadata((prev) => ({ 
      ...(prev ?? {}), 
      timestamp: new Date().toISOString(), 
      location: receiverLocation, 
      device: "Mobile Camera", 
      coordinates: prev?.coordinates ?? null 
    }));
    setCurrentStep(1);
    toast({ 
      title: "Demo Photo Generated", 
      description: "Mock verification photo created for demonstration" 
    });
  };

  const submitVerificationToSender = (verificationData: any) => {
    if (!transactionData?.transactionId) return;

    // Store verification data in localStorage for sender to pick up
    const verificationKey = `verification_${transactionData.transactionId}`;
    localStorage.setItem(verificationKey, JSON.stringify(verificationData));

    // Try to communicate with opener window (sender page)
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({
          type: 'VERIFICATION_COMPLETE',
          transactionId: transactionData.transactionId,
          data: verificationData
        }, '*');
        
        toast({
          title: "Verification Sent",
          description: "Verification data sent to sender successfully",
        });
      } catch (error) {
        console.log('Could not communicate with opener window, using localStorage fallback');
      }
    }

    // Also store in a general verification store for polling
    localStorage.setItem('lastVerification', JSON.stringify({
      transactionId: transactionData.transactionId,
      ...verificationData
    }));
  };

  const uploadVerificationToServer = async () => {
    if (!capturedPhoto || !transactionData) {
      toast({ 
        title: "No photo", 
        description: "Capture or upload a photo first", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create verification data
      const verificationData = {
        transactionId: transactionData.transactionId,
        photo: { 
          dataUrl: capturedPhoto, 
          metadata: photoMetadata 
        },
        location: receiverLocation,
        coordinates: photoMetadata?.coordinates,
        timestamp: new Date().toISOString(),
        deviceInfo: "Mobile Camera",
        aiConfidence: 0.94 + (Math.random() * 0.05), // 94-99% confidence
        locationAccuracy: "High (±5m)",
        verified: true,
        verificationTime: new Date().toISOString()
      };

      // Submit to sender
      submitVerificationToSender(verificationData);

      toast({ 
        title: "Verification Submitted", 
        description: "Your verification has been sent to the sender" 
      });

      setVerificationStatus("processing");
      setCurrentStep(2);

      // Simulate AI processing
      setTimeout(() => {
        setVerificationStatus("verified");
        setCurrentStep(3);
        toast({ 
          title: "AI Verification Complete", 
          description: "Your identity and location have been verified successfully" 
        });
      }, 2000);

    } catch (err) {
      console.error("Upload error", err);
      toast({ 
        title: "Upload failed", 
        description: "Could not send verification", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyWithAiLocalSimulation = async () => {
    setVerificationStatus("processing");
    setIsSubmitting(true);

    // Simulate step-by-step AI verification
    const steps = [
      "Analyzing photo authenticity...",
      "Verifying location data...",
      "Cross-referencing metadata...",
      "Final security check..."
    ];

    for (let i = 0; i < steps.length; i++) {
      toast({
        title: `AI Verification Step ${i + 1}`,
        description: steps[i],
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(i + 1);
    }

    const success = Math.random() > 0.1; // 90% success rate
    if (success) {
      setVerificationStatus("verified");
      
      // Create and send verification data
      const verificationData = {
        transactionId: transactionData?.transactionId,
        photo: { dataUrl: capturedPhoto, metadata: photoMetadata },
        location: receiverLocation,
        coordinates: photoMetadata?.coordinates,
        timestamp: new Date().toISOString(),
        deviceInfo: "Mobile Camera",
        aiConfidence: 0.92 + (Math.random() * 0.07), // 92-99%
        locationAccuracy: "High (±5m)",
        verified: true
      };

      if (transactionData?.transactionId) {
        submitVerificationToSender(verificationData);
      }

      toast({ 
        title: "AI Verification Successful", 
        description: "Your photo & location have been verified" 
      });
    } else {
      setVerificationStatus("failed");
      toast({ 
        title: "AI Verification Failed", 
        description: "Please retry verification", 
        variant: "destructive" 
      });
    }
    
    setIsSubmitting(false);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (!transactionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Transaction Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Open this page from the sender view using the "Receiver Point of View" button.
          </p>
          <div className="space-y-3">
            <Button onClick={handleGoBack} className="w-full">
              Go Back
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-green-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SafayPay</h1>
                <p className="text-xs text-slate-500">Receiver Verification</p>
              </div>
            </div>
            
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Identity Verification
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Verify your identity for secure transaction processing
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Card */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl">
              <h3 className="font-semibold text-slate-900 mb-4 text-lg">Transaction Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">Amount</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{transactionData.amount?.toLocaleString() ?? "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">Recipient</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {transactionData.recipient || "Your Account"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">Transaction ID</p>
                  <p className="font-mono text-slate-900 text-sm bg-slate-100 px-3 py-2 rounded-lg">
                    {transactionData.transactionId || transactionData.verificationId || "DEMO-TXN"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">Security Level</p>
                  <p className="font-semibold text-green-600 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Enhanced Verification
                  </p>
                </div>
              </div>
            </Card>

            {/* Identity Verification Card */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl">
              <h3 className="font-semibold text-slate-900 mb-4 text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> 
                Identity Verification
              </h3>

              {!capturedPhoto ? (
                <div className="text-center space-y-6">
                  <div className="relative bg-slate-900 rounded-2xl overflow-hidden mx-auto max-w-2xl h-80">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-green-400 border-dashed rounded-2xl pointer-events-none animate-pulse" />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-sm">Position your face in the frame and ensure good lighting</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button 
                      onClick={startCamera} 
                      variant="outline" 
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 min-w-[140px]"
                    >
                      Start Camera
                    </Button>
                    <Button 
                      onClick={capturePhoto} 
                      className="bg-blue-600 hover:bg-blue-700 min-w-[140px]"
                    >
                      <Camera className="h-4 w-4 mr-2" /> 
                      Capture Photo
                    </Button>
                    <Button 
                      onClick={generateMockPhoto} 
                      variant="ghost"
                      className="text-slate-600 hover:text-slate-900 min-w-[140px]"
                    >
                      Use Demo Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="relative bg-slate-900 rounded-2xl overflow-hidden mx-auto max-w-2xl h-80">
                    <img 
                      src={capturedPhoto} 
                      alt="Verification capture" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ✓ Captured
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-sm">Photo ready for verification</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button 
                      onClick={uploadVerificationToServer} 
                      className="bg-green-600 hover:bg-green-700 min-w-[160px]"
                      disabled={isSubmitting || verificationStatus === "processing"}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Verification
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => setCapturedPhoto(null)} 
                      variant="outline"
                      className="min-w-[120px]"
                    >
                      Retake Photo
                    </Button>
                    <Button 
                      onClick={verifyWithAiLocalSimulation} 
                      variant="ghost"
                      className="text-slate-600 hover:text-slate-900 min-w-[140px]"
                      disabled={isSubmitting}
                    >
                      AI Demo
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Location Verification Card */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl">
              <h3 className="font-semibold text-slate-900 mb-4 text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" /> 
                Location Verification
              </h3>
              <div className="p-5 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200/60">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 mb-2">Detected Location</p>
                    <p className="text-blue-800 text-lg font-medium">{receiverLocation}</p>
                    {photoMetadata?.coordinates && (
                      <div className="mt-3 text-sm text-blue-700 space-y-1">
                        <p>Coordinates: {photoMetadata.coordinates.lat.toFixed(6)}, {photoMetadata.coordinates.lng.toFixed(6)}</p>
                        <p>Timestamp: {new Date(photoMetadata?.timestamp || Date.now()).toLocaleString()}</p>
                        <p>Device: {photoMetadata.device || "Mobile Device"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-2xl">
              <h3 className="font-semibold text-slate-900 mb-6 text-lg">Verification Progress</h3>
              <div className="space-y-5">
                {[
                  { 
                    name: "Identity Verification", 
                    description: "Photo capture and validation",
                    status: currentStep >= 1 
                  },
                  { 
                    name: "Location Check", 
                    description: "GPS and location verification",
                    status: currentStep >= 2 
                  },
                  { 
                    name: "AI Analysis", 
                    description: "Artificial intelligence review",
                    status: currentStep >= 3 
                  },
                  { 
                    name: "Verification Complete", 
                    description: "Sent to sender for approval",
                    status: verificationStatus === "verified" 
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      step.status 
                        ? "bg-green-100 border-green-500 text-green-600 shadow-lg shadow-green-500/20" 
                        : "bg-slate-100 border-slate-300 text-slate-400"
                    }`}>
                      {step.status ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${
                        step.status ? "text-slate-900" : "text-slate-500"
                      }`}>
                        {step.name}
                      </p>
                      <p className={`text-sm ${
                        step.status ? "text-green-600" : "text-slate-400"
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Status Cards */}
            {verificationStatus === "verified" && (
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 shadow-lg rounded-2xl">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-green-900 text-xl mb-2">Verification Complete!</h3>
                  <p className="text-green-700 mb-2">Your identity and location were verified successfully</p>
                  <p className="text-green-600 text-sm mb-6">
                    AI Confidence: {Math.round((0.92 + Math.random() * 0.07) * 100)}%
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleGoBack}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl shadow-lg shadow-green-500/30"
                    >
                      Verification Complete
                    </Button>
                    <p className="text-xs text-green-600">
                      The sender will now review and complete the payment
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {verificationStatus === "failed" && (
              <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-100 border border-red-200 shadow-lg rounded-2xl">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h3 className="font-bold text-red-900 text-xl mb-2">Verification Failed</h3>
                  <p className="text-red-700 mb-4">Unable to verify your identity. Please try again.</p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      className="w-full border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Retry Verification
                    </Button>
                    <Button 
                      onClick={handleGoBack}
                      className="w-full bg-slate-600 hover:bg-slate-700"
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {verificationStatus === "processing" && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200 shadow-lg rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="font-bold text-blue-900 text-xl mb-2">AI Processing</h3>
                  <p className="text-blue-700 mb-2">Analyzing your verification data...</p>
                  <p className="text-blue-600 text-sm">
                    This may take a few moments
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ReceiverVerification;