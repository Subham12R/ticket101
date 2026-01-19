"use client";

import Image from 'next/image';
import {QRCodeCanvas, QRCodeSVG} from 'qrcode.react';
import html2canvas from 'html2canvas-pro';
import { useRef } from 'react';

interface Registration {
  name: string;
  type: string;
  username: string;
  event: string;
  referenceId: string;
  link: string;
  day: string;
}

const registration: Registration = {
  name: "Subham Karmakar",
  username: "Subham K",
  type: "Visitor",
  event: "Techfest",
  referenceId: "4234567890",
  link: "https://example.com/registration/4234567890",
  day: "Day 1",
};
export default function VisitorCard() {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current, { backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'ticket.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-zinc-900">
      <div ref={ticketRef} className="w-[400px] h-full bg-[#d400ff] rounded-[20px] p-1">
        <div className="w-full h-[600px] bg-zinc-950 px-8  rounded-[18px] shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl relative overflow-hidden">
          {/* Background video and Image */}
         
          <div className='absolute top-0 left-0 w-full h-full pb-20 z-0'>
            <Image src="/logo2.png" alt="Signifiya Logo" width={50} height={50} className="absolute top-2 left-2 bg-transparent backdrop-blur-3xl outline-white/10 outline rounded-full" />
            <video src="/bg.mp4" className="w-full h-50 object-cover" autoPlay loop muted></video>
          </div>

          <div>
            <Image src="/robo.png" alt="Description" width={200} height={100} className='absolute top-5 right-0'/>
          </div>

          {/* Header */}
          <div className="relative z-10 flex text-start justify-start gap-2 w-full h-50 items-end  pb-4">
            <div className='flex flex-row  justify-center items-center pt-12'>
              
              <h1 className="text-md tracking-tighter font-bold text-zinc-400">Signifiya</h1>
            </div>

            <h1 className="text-md tracking-tighter font-bold text-zinc-400">2026</h1>
          </div>

          {/* Event and Day */}
          <div className="flex text-center pt-2 justify-start gap-2 items-end">
            <h1 className="text-lg font-bold tracking-tighter text-zinc-400">Event : </h1>
            <span className="text-lg tracking-tighter font-semibold text-zinc-400">{registration.day}</span>
          </div>

     
          {/* Visitor Pass - Username */}
          <div className='mt-8 flex flex-col z-10'>
            <span className='w-full flex items-end z-10 justify-start text-zinc-500'>@{registration.type}.</span>
            <h1 className='text-5xl font-bold z-10 tracking-tighter leading-tighter'>{registration.username}</h1>
            
          </div>

          {/* QR Code and Booking ID */}
          <div className='mt-12 absolute bottom-16 flex flex-col justify-start items-start gap-2'>
            <div className='flex flex-row justify-center gap-8'>
              <QRCodeCanvas value={registration.link} className='p-2 border border-zinc-800 rounded-md border-dashed'/>
              <div className='gap-4 flex flex-col'>
                <div className='flex flex-col leading-2'>
                  <span className='text-zinc-500 font-medium tracking-tighter'>Booking ID</span>
                  <h1 className='text-2xl font-bold tracking-tighter'>#{registration.referenceId}</h1>
                </div>

            
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className='px-4 py-2 mt-2  flex justify-center w-[400px] items-center'>
          <button onClick={handleDownload} className='px-6 hover:text-white text-sm tracking-tighter font-bold text-zinc-400 font-semibold text-lg cursor-pointer rounded-[18px] bg-black w-full px-4 py-4 active:scale-98 active:translate-y-0.5 hover:bg-zinc-950 shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl transition-all duration-300 ease-in-out flex justify-center items-center'>
            Download Ticket
          </button>
        </div>
    </main>
  );
}
