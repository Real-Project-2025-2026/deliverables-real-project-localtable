
import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, CheckCircle, AlertCircle, Loader2, RefreshCw, SwitchCamera } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface Props {
  onValidate: (uuid: string) => boolean;
  onBack: () => void;
}

export default function QRScanner({ onValidate, onBack }: Props) {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "sponti-qr-reader";

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [facingMode]);

  const startScanner = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    // Ensure cleanup of previous instance if any
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        // Ignore stop errors on re-init
      }
    }

    try {
      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: facingMode },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Errors here are mostly "QR code not found in frame" which we ignore
        }
      );

      setScanning(true);
      setLoading(false);
    } catch (err: any) {
      console.error("QR Scanner Error:", err);
      setLoading(false);
      setScanning(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage("Camera access is required to scan QR codes. Please enable camera permissions in your browser.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage("No camera was found on this device.");
      } else {
        setErrorMessage("An unexpected error occurred while starting the camera.");
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  const handleScanSuccess = (uuid: string) => {
    const isValid = onValidate(uuid);
    
    if (isValid) {
      setResult('success');
      setScanning(false);
      stopScanner();
      // Keep success message for 2 seconds then navigate back or reset
      setTimeout(() => {
        onBack();
      }, 2000);
    } else {
      setResult('error');
      // Briefly show error then allow retry (keep scanning)
      setTimeout(() => setResult(null), 2000);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  return (
    <div className="h-full flex flex-col relative text-white bg-black font-sf overflow-hidden">
       {/* Top Controls */}
       <div className="absolute top-6 left-0 right-0 z-50 px-6 flex justify-between items-center pointer-events-none">
          <button 
            onClick={onBack} 
            className="glass p-3 rounded-full hover:bg-white/20 transition-colors pointer-events-auto shadow-lg"
          >
            <X size={24} />
          </button>
          
          {scanning && !result && (
            <button 
              onClick={toggleCamera} 
              className="glass p-3 rounded-full hover:bg-white/20 transition-colors pointer-events-auto shadow-lg"
              title="Switch Camera"
            >
              <SwitchCamera size={24} />
            </button>
          )}
       </div>

       {/* Main Scanner Viewport */}
       <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
          
          {/* Real Camera Feed Container */}
          <div 
            id={scannerContainerId} 
            className={`absolute inset-0 z-0 bg-slate-900 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
          ></div>

          {/* Loading State */}
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                <Loader2 size={48} className="text-neon-blue animate-spin mb-4" />
                <p className="text-white font-medium">Requesting camera access...</p>
            </div>
          )}

          {/* Error Message UI */}
          {errorMessage && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/90 backdrop-blur-md animate-fade-in text-center">
                <AlertCircle size={64} className="text-red-500 mb-6" />
                <h3 className="text-xl font-bold mb-4">Camera Error</h3>
                <p className="text-white/60 mb-8 max-w-[280px] leading-relaxed">
                  {errorMessage}
                </p>
                <div className="flex flex-col gap-3 w-full max-w-[200px]">
                  <button 
                    onClick={startScanner}
                    className="w-full bg-white text-black font-bold py-3 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} /> Retry
                  </button>
                  <button 
                    onClick={onBack}
                    className="w-full glass py-3 rounded-2xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
            </div>
          )}

          {/* Scanning HUD */}
          {scanning && !result && (
            <div className="relative z-10 flex flex-col items-center">
               {/* Scan Frame */}
               <div className="w-64 h-64 border-[3px] border-white/20 rounded-[40px] relative overflow-hidden">
                  {/* Cyber Glow Corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-neon-blue rounded-tl-[40px] shadow-[-5px_-5px_15px_rgba(76,122,244,0.5)]"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-neon-blue rounded-tr-[40px] shadow-[5px_-5px_15px_rgba(76,122,244,0.5)]"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-neon-blue rounded-bl-[40px] shadow-[-5px_5px_15px_rgba(76,122,244,0.5)]"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-neon-blue rounded-br-[40px] shadow-[5px_5px_15px_rgba(76,122,244,0.5)]"></div>
                  
                  {/* Animated Scan Line */}
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent absolute top-0 animate-[scan_2s_infinite] shadow-[0_0_15px_#4C7AF4]"></div>
               </div>
               
               <p className="mt-12 font-medium text-white tracking-wide text-sm bg-black/60 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
                 Align Sponti QR code
               </p>
            </div>
          )}

          {/* Invalid Scan Feedback */}
          {result === 'error' && (
            <div className="absolute inset-0 z-30 bg-red-600/40 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
               <AlertCircle size={80} className="text-white mb-4 animate-shake" />
               <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Invalid Code</h2>
               <p className="text-white/80 mt-2">Try scanning another deal</p>
            </div>
          )}

          {/* Success Overlay */}
          {result === 'success' && (
            <div className="absolute inset-0 z-40 bg-cyber-dark flex flex-col items-center justify-center animate-fade-in">
                <div className="bg-gradient-to-tr from-green-400 to-emerald-600 text-white p-8 rounded-full shadow-[0_0_50px_rgba(52,211,153,0.5)] mb-8 animate-bounce">
                   <CheckCircle size={64} />
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Success!</h2>
                <p className="text-white/50">Deal validated & redeemed.</p>
            </div>
          )}
       </div>
       
       <style>{`
         @keyframes scan {
           0% { top: 0; opacity: 0; }
           10% { opacity: 1; }
           90% { opacity: 1; }
           100% { top: 100%; opacity: 0; }
         }
         @keyframes shake {
           0%, 100% { transform: translateX(0); }
           25% { transform: translateX(-10px); }
           75% { transform: translateX(10px); }
         }
         .animate-shake {
           animation: shake 0.3s ease-in-out infinite;
         }
         #sponti-qr-reader video {
           object-fit: cover !important;
           width: 100% !important;
           height: 100% !important;
         }
       `}</style>
    </div>
  );
}
