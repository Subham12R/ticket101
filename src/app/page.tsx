"use client";


import EventCard from './Event/page';
import ScannerPage from './scanner/page';
import VisitorCard from './Visitor/page';


export default function Home() {



  return (
    <>
      <ScannerPage />
      <VisitorCard />
      <EventCard />
    </>
  );
}
