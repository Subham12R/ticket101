"use client";

import { useState } from 'react';
import QRScanner from '../components/QRScanner';
import { Toaster, toast } from 'sonner';

interface VerificationResult {
  success: boolean;
  message: string;
  data?: {
    referenceId: string;
    name: string;
    username: string;
    type: string;
    eventName: string;
    eventTime: string;
    teamName: string;
    day: string;
    verified: boolean;
  };
  error?: string;
}

export default function ScannerPage() {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string>('');

  const extractReferenceId = (url: string): string | null => {
    try {
      // If it's a full URL, extract the reference ID from the path
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        return pathParts[pathParts.length - 1];
      }
      // If it's just the reference ID
      return url;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  };

  const verifyTicket = async (scannedText: string) => {
    setLoading(true);
    setScannedUrl(scannedText);

    // Show scanning toast
    toast.loading('Scanning QR code...', { id: 'scan' });

    const referenceId = extractReferenceId(scannedText);

    if (!referenceId) {
      toast.error('Invalid QR code format', { id: 'scan' });
      setVerificationResult({
        success: false,
        message: 'Invalid QR code format',
        error: 'INVALID_FORMAT'
      });
      setLoading(false);
      return;
    }

    toast.loading('Verifying ticket...', { id: 'scan' });

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referenceId }),
      });

      const data = await response.json();
      setVerificationResult(data);

      // Show success or error toast
      if (data.success) {
        toast.success('Ticket verified successfully!', {
          id: 'scan',
          description: `Welcome ${data.data?.name}`,
          duration: 4000,
        });
      } else {
        toast.error(data.message, {
          id: 'scan',
          description: data.error || 'Please try again',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify ticket', {
        id: 'scan',
        description: 'Network error. Please check your connection.',
        duration: 5000,
      });
      setVerificationResult({
        success: false,
        message: 'Failed to verify ticket',
        error: 'NETWORK_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVerificationResult(null);
    setScannedUrl('');
    toast.info('Ready to scan', { description: 'Position QR code in camera view' });
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black flex flex-col">
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        richColors
        expand={true}
        toastOptions={{
          style: {
            background: '#18181b',
            border: '1px solid #27272a',
            color: '#ffffff',
          },
          className: 'sonner-toast',
        }}
      />
      {/* Header */}
      <div className="w-full bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-[#d400ff] to-blue-600 rounded-xl flex items-center justify-center shadow-[0px_0px_15px_rgba(212,0,255,0.5)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Ticket Verification</h1>
                <p className="text-xs text-zinc-400 hidden sm:block">Scan & verify event tickets</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                verificationResult?.success
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : verificationResult?.error
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {verificationResult?.success
                  ? '✓ Verified'
                  : verificationResult?.error
                  ? '✗ Failed'
                  : 'Ready'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          {!verificationResult ? (
            <div className="space-y-6 animate-fade-in-up">
              {/* Scanner Card */}
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-zinc-800/50">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 bg-linear-to-r from-[#d400ff] to-blue-500 bg-clip-text text-transparent">
                    Scan QR Code
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-400">Position the QR code within the camera frame</p>
                </div>

                <QRScanner onScanSuccess={verifyTicket} />

                {loading && (
                  <div className="mt-8 flex flex-col items-center gap-4 animate-pulse">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-[#d400ff]/30 border-t-[#d400ff] rounded-full animate-spin"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-lg">Verifying Ticket...</p>
                      <p className="text-zinc-400 text-sm mt-1">Please wait</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Cards - Mobile First */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-zinc-900/30 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/50 text-center">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Fast Scanning</h3>
                  <p className="text-zinc-500 text-xs">Instant verification in seconds</p>
                </div>

                <div className="bg-zinc-900/30 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/50 text-center">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Secure</h3>
                  <p className="text-zinc-500 text-xs">Protected verification system</p>
                </div>

                <div className="bg-zinc-900/30 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/50 text-center">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Detailed Info</h3>
                  <p className="text-zinc-500 text-xs">Complete ticket information</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`space-y-6 animate-fade-in-up`}>
              {/* Result Card */}
              <div className={`bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 ${
                verificationResult.success
                  ? 'border-green-500/50 shadow-[0px_0px_40px_rgba(34,197,94,0.3)]'
                  : 'border-red-500/50 shadow-[0px_0px_40px_rgba(239,68,68,0.3)]'
              }`}>
                <div className="flex flex-col items-center gap-6">
                  {/* Status Animation */}
                  <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center animate-scale-in ${
                    verificationResult.success ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <div className={`absolute inset-0 rounded-full animate-ping ${
                      verificationResult.success ? 'bg-green-500/30' : 'bg-red-500/30'
                    }`}></div>
                    {verificationResult.success ? (
                      <svg className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-14 h-14 sm:w-16 sm:h-16 text-red-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>

                  {/* Message */}
                  <div className="text-center">
                    <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                      verificationResult.success ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {verificationResult.message}
                    </h2>
                    <p className="text-zinc-400 text-sm">
                      {verificationResult.success ? 'Entry authorized' : 'Access denied'}
                    </p>
                  </div>

                  {/* Ticket Details - Mobile Responsive */}
                  {verificationResult.data && (
                    <div className="w-full bg-zinc-950/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-zinc-800/50">
                      <h3 className="text-white font-bold text-lg mb-4 pb-2 border-b border-zinc-800">Ticket Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DetailItem label="Name" value={verificationResult.data.name} />
                        <DetailItem label="Username" value={verificationResult.data.username} />
                        <DetailItem label="Type" value={verificationResult.data.type} />
                        <DetailItem label="Event" value={verificationResult.data.eventName} />
                        <DetailItem label="Time" value={verificationResult.data.eventTime} />
                        <DetailItem label="Team" value={verificationResult.data.teamName} />
                        <DetailItem label="Day" value={verificationResult.data.day} />
                        <DetailItem label="Reference ID" value={`#${verificationResult.data.referenceId}`} highlight />
                      </div>
                    </div>
                  )}

                  {/* Error Details */}
                  {verificationResult.error && (
                    <div className="w-full bg-red-500/10 backdrop-blur-xl rounded-2xl p-4 border border-red-500/30">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-red-400 font-semibold text-sm">Error: {verificationResult.error}</p>
                          {scannedUrl && (
                            <p className="text-zinc-500 text-xs mt-1 break-all">Scanned: {scannedUrl}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button - Full Width on Mobile */}
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto group relative px-8 py-4 bg-linear-to-r from-[#d400ff] to-blue-600 text-white font-bold text-base sm:text-lg rounded-2xl shadow-[0px_0px_20px_2px_rgba(212,0,255,0.5)] hover:shadow-[0px_0px_30px_5px_rgba(212,0,255,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Scan Another Ticket
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </main>
  );
}

function DetailItem({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className={`font-semibold text-sm sm:text-base ${highlight ? 'text-[#d400ff]' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
