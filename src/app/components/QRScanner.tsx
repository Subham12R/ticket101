"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!scannerRef.current && scanning) {
      setIsInitializing(true);

      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          console.log('QR Code scanned:', decodedText);
          onScanSuccess(decodedText);
          setScanning(false);
        },
        (error) => {
          // Ignore frequent scan errors
          if (onScanError && !error.includes('NotFoundException')) {
            console.warn('QR Scan Error:', error);
          }
        }
      );

      scannerRef.current = scanner;

      // Set initializing to false after a short delay
      setTimeout(() => setIsInitializing(false), 1000);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error('Failed to clear scanner:', error);
        });
        scannerRef.current = null;
      }
    };
  }, [scanning, onScanSuccess, onScanError]);

  const handleRescan = () => {
    setScanning(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Scanner Frame */}
      <div className="relative w-full max-w-lg">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#d400ff] rounded-tl-2xl z-10"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#d400ff] rounded-tr-2xl z-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#d400ff] rounded-bl-2xl z-10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#d400ff] rounded-br-2xl z-10"></div>

        {/* Scanner Container */}
        <div className="relative bg-zinc-900 rounded-2xl p-4 shadow-[0px_0px_30px_5px_rgba(212,0,255,0.3)]">
          <div
            id="qr-reader"
            className="w-full rounded-xl overflow-hidden"
            style={{
              border: 'none',
            }}
          ></div>

          {/* Loading Overlay */}
          {isInitializing && scanning && (
            <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#d400ff]/30 border-t-[#d400ff] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-zinc-400 text-sm font-medium animate-pulse">Initializing camera...</p>
              </div>
            </div>
          )}

          {/* Scanning Animation Overlay */}
          {!isInitializing && scanning && (
            <div className="absolute inset-4 pointer-events-none">
              <div className="w-full h-full relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d400ff] to-transparent animate-scan"></div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {scanning && !isInitializing && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-zinc-400 text-sm font-medium mb-2">Position the QR code within the frame</p>
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Keep your device steady for best results</span>
            </div>
          </div>
        )}
      </div>

      {/* Rescan Button */}
      {!scanning && (
        <button
          onClick={handleRescan}
          className="group relative px-8 py-4 bg-gradient-to-r from-[#d400ff] to-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0px_0px_20px_2px_rgba(212,0,255,0.5)] hover:shadow-[0px_0px_30px_5px_rgba(212,0,255,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Scan Another Ticket
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#d400ff] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      )}

      <style jsx>{`
        @keyframes scan {
          0%, 100% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        /* Custom styles for html5-qrcode */
        #qr-reader {
          border: none !important;
        }

        #qr-reader__dashboard_section {
          display: none !important;
        }

        #qr-reader__camera_selection {
          background: transparent !important;
          border: none !important;
        }

        #qr-reader video {
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
}
