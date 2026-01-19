# Event Ticket System

A modern, customizable event ticket generation and verification system built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- **Ticket Generation**: Create beautiful, customizable event tickets with QR codes
- **QR Code Verification**: Real-time ticket verification via QR code scanning
- **Download Functionality**: Export tickets as PNG images
- **Responsive Design**: Mobile-friendly and accessible
- **Database Ready**: Easy integration with Supabase or any database

## Demo

The ticket includes:
- Event branding (logo and name)
- Visitor information (name, username, type)
- Event details (name, time, team, day)
- QR code for verification
- Unique booking/reference ID

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **QR Code Generation**: qrcode.react
- **QR Code Scanning**: html5-qrcode
- **Image Export**: html2canvas-pro
- **Database**: Supabase (recommended)

## Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ticket

# Install dependencies
npm install
```

### 2. Install Supabase (if not already installed)

```bash
npm install @supabase/supabase-js
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Database Setup

### Database Schema

Create the following table in your Supabase SQL Editor:

```sql
-- Create registrations table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  type TEXT DEFAULT 'Visitor',
  event_name TEXT NOT NULL,
  event_time TEXT NOT NULL,
  team_name TEXT,
  reference_id TEXT UNIQUE NOT NULL,
  day TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups
CREATE INDEX idx_reference_id ON registrations(reference_id);
CREATE INDEX idx_user_id ON registrations(user_id);
CREATE INDEX idx_verified ON registrations(verified);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own registrations
CREATE POLICY "Users can insert own registrations"
  ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own registrations
CREATE POLICY "Users can update own registrations"
  ON registrations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Allow verification endpoint to check any registration
CREATE POLICY "Allow verification checks"
  ON registrations FOR SELECT
  USING (true);

-- Policy: Allow verification endpoint to update verified status
CREATE POLICY "Allow verification updates"
  ON registrations FOR UPDATE
  USING (true)
  WITH CHECK (verified = true);

-- Function to generate unique reference ID
CREATE OR REPLACE FUNCTION generate_reference_id()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 10000000000)::TEXT, 10, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate reference_id if not provided
CREATE OR REPLACE FUNCTION set_reference_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_id IS NULL OR NEW.reference_id = '' THEN
    NEW.reference_id := generate_reference_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_reference_id
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_reference_id();
```

## Project Structure

```
ticket/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── verify/
│   │   │       └── route.ts          # Verification API endpoint
│   │   ├── components/
│   │   │   └── QRScanner.tsx         # QR code scanner component
│   │   ├── Event/
│   │   │   └── page.tsx              # Ticket card component
│   │   ├── scanner/
│   │   │   └── page.tsx              # Scanner page
│   │   ├── profile/
│   │   │   └── page.tsx              # User profile with tickets
│   │   └── page.tsx                  # Home page
│   └── lib/
│       └── supabase.ts                # Supabase client
├── public/
│   ├── logo2.png                      # Event logo
│   ├── robo.png                       # Decoration image
│   └── bg.mp4                         # Background video
└── README.md
```

## Setup Guide

### 1. Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Registration {
  id: string;
  user_id: string;
  name: string;
  username: string;
  type: string;
  event_name: string;
  event_time: string;
  team_name: string;
  reference_id: string;
  day: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}
```

### 2. Update API Verification Endpoint

Update `src/app/api/verify/route.ts` to use Supabase:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referenceId } = body;

    if (!referenceId) {
      return NextResponse.json(
        { error: 'Reference ID is required' },
        { status: 400 }
      );
    }

    // Fetch registration from Supabase
    const { data: registration, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();

    if (error || !registration) {
      return NextResponse.json(
        {
          success: false,
          message: 'Registration not found',
          error: 'INVALID_REFERENCE_ID'
        },
        { status: 404 }
      );
    }

    if (registration.verified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ticket already verified',
          error: 'ALREADY_VERIFIED',
          data: {
            referenceId: registration.reference_id,
            name: registration.name,
            username: registration.username,
            type: registration.type,
            eventName: registration.event_name,
            eventTime: registration.event_time,
            teamName: registration.team_name,
            day: registration.day,
            verified: registration.verified,
          },
        },
        { status: 200 }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ verified: true, updated_at: new Date().toISOString() })
      .eq('reference_id', referenceId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration verified successfully',
        data: {
          referenceId: registration.reference_id,
          name: registration.name,
          username: registration.username,
          type: registration.type,
          eventName: registration.event_name,
          eventTime: registration.event_time,
          teamName: registration.team_name,
          day: registration.day,
          verified: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. Create Profile Page with Tickets

Create `src/app/profile/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from 'react';
import { supabase, Registration } from '@/lib/supabase';
import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas-pro';

export default function ProfilePage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserAndRegistrations();
  }, []);

  const fetchUserAndRegistrations = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      setUser(user);

      // Fetch user's registrations
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (registration: Registration, index: number) => {
    const ticketElement = document.getElementById(`ticket-${index}`);

    if (ticketElement) {
      const canvas = await html2canvas(ticketElement, { backgroundColor: null });
      const link = document.createElement('a');
      link.download = `ticket-${registration.reference_id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-white text-xl">Loading tickets...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Please log in to view your tickets</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Tickets</h1>
          <p className="text-zinc-400">View and download your event tickets</p>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No tickets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {registrations.map((registration, index) => (
              <div key={registration.id} className="flex flex-col gap-4">
                <TicketCard registration={registration} index={index} />
                <button
                  onClick={() => handleDownload(registration, index)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Download Ticket
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function TicketCard({ registration, index }: { registration: Registration; index: number }) {
  const qrLink = `${window.location.origin}/api/verify?ref=${registration.reference_id}`;

  return (
    <div id={`ticket-${index}`} className="w-full bg-[#d400ff] rounded-[20px] p-1">
      <div className="w-full h-[600px] bg-zinc-950 px-8 rounded-[18px] shadow-[0px_0px_10px_2px_rgba(0,0,255,0.8)] backdrop-blur-2xl relative overflow-hidden">
        {/* Background */}
        <div className='absolute top-0 left-0 w-full h-full pb-20 z-0'>
          <Image
            src="/logo2.png"
            alt="Logo"
            width={50}
            height={50}
            className="absolute top-2 left-2 bg-transparent backdrop-blur-3xl outline-white/10 outline rounded-full"
          />
          <video src="/bg.mp4" className="w-full h-50 object-cover" autoPlay loop muted></video>
        </div>

        <div>
          <Image src="/robo.png" alt="Decoration" width={200} height={100} className='absolute top-5 right-0'/>
        </div>

        {/* Header */}
        <div className="relative z-10 flex text-start justify-start gap-2 w-full h-50 items-end pb-4">
          <div className='flex flex-row justify-center items-center pt-12'>
            <h1 className="text-md tracking-tighter font-bold text-zinc-400">Signifiya</h1>
          </div>
          <h1 className="text-md tracking-tighter font-bold text-zinc-400">2026</h1>
        </div>

        {/* Event */}
        <div className="flex text-center pt-2 justify-start gap-2 items-end">
          <h1 className="text-lg font-bold tracking-tighter text-zinc-400">Event:</h1>
          <span className="text-lg tracking-tighter font-semibold text-zinc-400">{registration.day}</span>
        </div>

        {/* Visitor */}
        <div className='mt-8 flex flex-col z-10'>
          <span className='w-full flex items-end z-10 justify-start text-zinc-500'>@{registration.type}.</span>
          <h1 className='text-5xl font-bold z-10 tracking-tighter leading-tight'>{registration.username}</h1>
        </div>

        {/* QR Code and Details */}
        <div className='mt-12 absolute bottom-16 flex flex-col justify-start items-start gap-2'>
          <div className='flex flex-row justify-center gap-8'>
            <QRCodeCanvas value={qrLink} className='p-2 border border-zinc-800 rounded-md border-dashed'/>
            <div className='gap-2 flex flex-col'>
              <div className='flex flex-col leading-tight'>
                <span className='text-zinc-500 font-medium tracking-tighter text-xs'>Booking ID</span>
                <h1 className='text-xl font-bold tracking-tighter'>#{registration.reference_id}</h1>
              </div>
              <div className='flex flex-col leading-tight'>
                <span className='text-zinc-500 font-medium tracking-tighter text-xs'>Event Name</span>
                <h2 className='text-sm font-semibold tracking-tighter text-white'>{registration.event_name}</h2>
              </div>
              <div className='flex flex-col leading-tight'>
                <span className='text-zinc-500 font-medium tracking-tighter text-xs'>Event Time</span>
                <h2 className='text-sm font-semibold tracking-tighter text-white'>{registration.event_time}</h2>
              </div>
              <div className='flex flex-col leading-tight'>
                <span className='text-zinc-500 font-medium tracking-tighter text-xs'>Team Name</span>
                <h2 className='text-sm font-semibold tracking-tighter text-white'>{registration.team_name}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Usage

### Running the Development Server

```bash
npm run dev
```

Visit:
- `http://localhost:3000` - Home page (single ticket demo)
- `http://localhost:3000/profile` - User profile with all tickets
- `http://localhost:3000/scanner` - QR code scanner for verification

### Creating a Registration

```typescript
import { supabase } from '@/lib/supabase';

async function createRegistration() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from('registrations')
    .insert([
      {
        user_id: user.id,
        name: 'John Doe',
        username: 'johndoe',
        type: 'Visitor',
        event_name: 'Techfest',
        event_time: '10:00 AM - 5:00 PM',
        team_name: 'Team Alpha',
        day: 'Day 1',
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating registration:', error);
    return;
  }

  console.log('Registration created:', data);
}
```

### Integration with Your Existing App

#### Step 1: Install the Ticket Component

Copy the EventCard component and integrate it:

```typescript
import EventCard from '@/app/Event/page';
```

#### Step 2: Fetch User Registrations in Profile

```typescript
const { data: registrations } = await supabase
  .from('registrations')
  .select('*')
  .eq('user_id', user.id);
```

#### Step 3: Render Tickets with Download

```typescript
{registrations.map((reg, index) => (
  <div key={reg.id}>
    <EventCard registration={reg} index={index} />
    <button onClick={() => downloadTicket(reg, index)}>
      Download Ticket
    </button>
  </div>
))}
```

## Customization

### Ticket Design

Edit `src/app/Event/page.tsx` to customize:
- Colors and gradients
- Logo placement
- Typography
- Layout structure

### Database Fields

Add custom fields to your Supabase table and update the TypeScript interface.

## API Endpoints

### POST /api/verify

Verifies a ticket by reference ID.

**Request:**
```json
{
  "referenceId": "4234567890"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration verified successfully",
  "data": {
    "referenceId": "4234567890",
    "name": "John Doe",
    "verified": true
  }
}
```

## Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Security

1. **Row Level Security**: Enabled on Supabase
2. **Authentication**: Supabase Auth
3. **HTTPS**: Required for production

## Troubleshooting

### QR Scanner Issues
- Use HTTPS (required for camera)
- Check browser permissions
- Test on different devices

### Download Issues
- Verify html2canvas-pro installation
- Check CORS for images
- Ensure assets are loaded

## License

MIT License

---

Made with ❤️ using Next.js and Supabase
