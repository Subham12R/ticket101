"use client";

import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';

export default function TestQRPage() {
  // This matches the dummy data in your Event card
  const testData = {
    name: "Subham Karmakar",
    username: "Subham K",
    type: "Visitor",
    eventName: "Techfest",
    eventTime: "10:00 AM - 5:00 PM",
    teamName: "Team Alpha",
    referenceId: "4234567890",
    day: "Day 1",
  };

  // Generate the URL that the scanner expects
  const qrLink = `https://example.com/registration/${testData.referenceId}`;

  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800/50">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Test QR Code
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Scan this QR code with the scanner to test verification
            </p>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center gap-6">
            {/* QR Code with Border */}
            <div className="relative p-8 bg-white rounded-3xl shadow-[0px_0px_40px_rgba(212,0,255,0.4)]">
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#d400ff] rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#d400ff] rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#d400ff] rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#d400ff] rounded-br-2xl"></div>

              <QRCodeCanvas
                value={qrLink}
                size={280}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Test Data Info */}
            <div className="w-full bg-zinc-950/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50">
              <h3 className="text-white font-bold text-lg mb-4 pb-2 border-b border-zinc-800">
                Test Ticket Data
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-zinc-500 block text-xs uppercase mb-1">Name</span>
                  <span className="text-white font-semibold">{testData.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs uppercase mb-1">Username</span>
                  <span className="text-white font-semibold">{testData.username}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs uppercase mb-1">Type</span>
                  <span className="text-white font-semibold">{testData.type}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs uppercase mb-1">Event</span>
                  <span className="text-white font-semibold">{testData.eventName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs uppercase mb-1">Time</span>
                  <span className="text-white font-semibold">{testData.eventTime}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs uppercase mb-1">Team</span>
                  <span className="text-white font-semibold">{testData.teamName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs uppercase mb-1">Day</span>
                  <span className="text-white font-semibold">{testData.day}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs uppercase mb-1">Reference ID</span>
                  <span className="text-[#d400ff] font-semibold">#{testData.referenceId}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800">
                <span className="text-zinc-500 block text-xs uppercase mb-1">QR Data</span>
                <code className="text-xs text-zinc-400 break-all block bg-zinc-900 p-2 rounded">
                  {qrLink}
                </code>
              </div>
            </div>

            {/* Instructions Toggle */}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-[#d400ff] hover:text-blue-400 text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              {showInstructions ? 'Hide' : 'Show'} Instructions
              <svg
                className={`w-4 h-4 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Instructions */}
            {showInstructions && (
              <div className="w-full bg-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 animate-fade-in">
                <h3 className="text-blue-400 font-bold text-lg mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How to Test
                </h3>
                <ol className="space-y-3 text-sm text-zinc-300">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#d400ff] rounded-full flex items-center justify-center text-white font-bold text-xs">
                      1
                    </span>
                    <span>
                      Open the <a href="/scanner" className="text-[#d400ff] hover:underline font-semibold">Scanner Page</a> on another device or in a new tab
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#d400ff] rounded-full flex items-center justify-center text-white font-bold text-xs">
                      2
                    </span>
                    <span>Allow camera permissions when prompted</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#d400ff] rounded-full flex items-center justify-center text-white font-bold text-xs">
                      3
                    </span>
                    <span>Point your device camera at the QR code above</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#d400ff] rounded-full flex items-center justify-center text-white font-bold text-xs">
                      4
                    </span>
                    <span>The scanner will automatically detect and verify the ticket</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      ✓
                    </span>
                    <span>You should see a success message with the ticket details</span>
                  </li>
                </ol>

                <div className="mt-4 pt-4 border-t border-blue-500/30">
                  <p className="text-xs text-zinc-400">
                    <strong className="text-blue-400">Note:</strong> This QR code contains the reference ID{' '}
                    <span className="text-[#d400ff] font-mono">{testData.referenceId}</span> which matches the dummy data
                    in the mock database. The first scan will mark it as verified.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a
                href="/scanner"
                className="flex-1 group relative px-6 py-4 bg-linear-to-r from-[#d400ff] to-blue-600 text-white font-bold text-center rounded-2xl shadow-[0px_0px_20px_2px_rgba(212,0,255,0.5)] hover:shadow-[0px_0px_30px_5px_rgba(212,0,255,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Open Scanner
                </span>
              </a>

              <a
                href="/"
                className="flex-1 px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-center rounded-2xl border border-zinc-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                View Ticket Card
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
