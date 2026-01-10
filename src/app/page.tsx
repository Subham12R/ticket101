"use client";

import Image from 'next/image';
import {QRCodeCanvas, QRCodeSVG} from 'qrcode.react';
import html2canvas from 'html2canvas-pro';
import { useRef } from 'react';

interface Registration {
  name: string;
  username: string;
  event: string;
  referenceId: string;
  link: string;
}

const registration: Registration = {
  name: "John Doe",
  username: "Attendee",
  event: "Techfest",
  referenceId: "4234567890",
  link: "https://example.com/registration/4234567890",
};
export default function Home() {
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
      <div ref={ticketRef} className="w-[400px] h-full bg-[#738AD0] rounded-[20px] p-1">
        <div className="w-full h-[600px] bg-zinc-950 px-12 rounded-[18px] shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl relative overflow-hidden">
          {/* Black overlay only on bg image */}
          <div className='absolute top-0 left-0 w-full h-full pb-20  z-0'>
            <video src="/bg.mp4" className="w-full h-50 object-cover" autoPlay loop muted></video>
          </div>
          <div className="relative z-10 flex  text-start justify-between w-full h-50 items-end border-b border-dashed border-b-zinc-800 pb-4">
              <h1 className="text-md tracking-tighter font-bold  pt-12  text-zinc-400 ">Signifiya</h1>
              <h1  className="text-md tracking-tighter font-bold text-zinc-400"> 2K26</h1>
            </div>
            <div className="flex text-center pt-2 justify-between items-end">
              <h1 className="text-lg font-bold tracking-tighter text-zinc-400">Event</h1>
              <span className="text-lg tracking-tighter font-medium text-zinc-400">{registration.event}</span>
            </div>
            <div className='mt-12 flex flex-col gap-2 z-10'>
              <span className='w-full flex items-end z-10 justify-start text-zinc-500'>@{registration.username}.</span>
              <h1 className='text-6xl font-bold z-10 tracking-tighter leading-10'>{registration.name}</h1>
            </div>
            <div className='mt-12 absolute bottom-16 flex flex-col justify-start items-start gap-2'>
              <div className='flex flex-row justify-center gap-8'>
                <QRCodeCanvas value={registration.link} className='p-2 border border-zinc-800 rounded-md border-dashed'/>
                <div className='gap-4 flex flex-col'>
                  <div className='flex flex-col leading-2'>
                  <span className='text-zinc-500 font-medium tracking-tighter'>Reference ID</span>
                  <h1 className='text-2xl font-bold tracking-tighter'>{registration.referenceId}</h1>
                </div>

                <div className='flex flex-col leading-4'>
                  <span className='text-zinc-500 font-medium tracking-tighter text-balance'>for any assistance contact the signifiya helpdesk</span>

                </div>
                </div>
              </div>
            </div>
        </div>

        <div className='px-[0.5px] mt-2 w-full flex justify-center items-center w-full'>
          <button onClick={handleDownload} className='hover:text-white text-sm tracking-tighter font-bold text-zinc-400 font-semibold text-lg cursor-pointer rounded-[18px] bg-black w-full px-4 py-4 active:scale-98 active:translate-y-0.5 hover:bg-zinc-950 shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl transition-all duration-300 ease-in-out flex justify-center items-center'>
            Download Ticket
          </button>
        </div>
      </div>
    </main>
  );
}
