# Event Ticket System - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Components Documentation](#components-documentation)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Usage Guide](#usage-guide)
10. [Customization](#customization)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

The Event Ticket System is a comprehensive solution for generating, distributing, and verifying event tickets. Built with Next.js 16, React 19, and TypeScript, it provides a modern, secure, and user-friendly experience for both event organizers and attendees.

### Key Highlights

- **QR Code Generation**: Automatic QR code generation for each ticket
- **Real-time Verification**: Instant ticket verification via camera scanning
- **Mobile-First Design**: Optimized for all devices, especially mobile
- **Database Integration**: Ready for Supabase or any PostgreSQL database
- **Download Capability**: Export tickets as high-quality PNG images
- **Toast Notifications**: Real-time feedback using Sonner
- **Secure**: Row-level security and verification tracking

---

## Features

### Ticket Generation
- Custom ticket design with gradient borders and shadows
- Animated background with video support
- QR code with verification URL
- Visitor information display
- Event details (name, time, team, day)
- Unique booking/reference ID

### QR Code Scanner
- Real-time camera-based scanning
- Auto-detection and verification
- Support for torch/flashlight (device-dependent)
- Zoom controls (device-dependent)
- Loading states and animations
- Scanning animation overlay
- Mobile-optimized interface

### Verification System
- Instant ticket verification
- Duplicate detection (already verified)
- Invalid ticket detection
- Network error handling
- Detailed verification results
- Toast notifications for all states

### User Interface
- Modern glassmorphism design
- Gradient accents (purple to blue)
- Smooth animations and transitions
- Responsive grid layouts
- Mobile-first approach
- Accessible color contrasts

---

## Architecture

### Directory Structure

```
ticket/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── verify/
│   │   │       └── route.ts              # Verification API endpoint
│   │   ├── components/
│   │   │   └── QRScanner.tsx             # QR scanner component
│   │   ├── Event/
│   │   │   └── page.tsx                  # Ticket card component
│   │   ├── scanner/
│   │   │   └── page.tsx                  # Scanner interface
│   │   ├── test-qr/
│   │   │   └── page.tsx                  # Test QR code generator
│   │   ├── profile/
│   │   │   └── page.tsx                  # User profile (optional)
│   │   └── page.tsx                      # Home page
│   └── lib/
│       └── supabase.ts                    # Supabase client (to create)
├── public/
│   ├── logo2.png                          # Event logo
│   ├── robo.png                           # Decoration image
│   └── bg.mp4                             # Background video
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── README.md
└── DOCUMENTATION.md
```

### Tech Stack

**Frontend:**
- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4

**Libraries:**
- qrcode.react - QR code generation
- html5-qrcode - QR code scanning
- html2canvas-pro - Image export
- sonner - Toast notifications

**Backend:**
- Next.js API Routes
- Supabase (recommended) or PostgreSQL
- Row Level Security (RLS)

---

## Installation

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun
- Git

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ticket

# Install dependencies
npm install
```

### Step 2: Install Supabase SDK

```bash
npm install @supabase/supabase-js
```

### Step 3: Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Configuration

### Tailwind CSS

The project uses Tailwind CSS 4 with custom configurations for gradients, shadows, and animations. Key classes:

- `bg-linear-to-r`: Linear gradients
- `shadow-[0px_0px_20px_2px_rgba(212,0,255,0.5)]`: Custom purple glow
- Custom animations defined in component styles

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes (if using Supabase) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes (if using Supabase) |

---

## Components Documentation

### 1. EventCard Component

**Location:** `src/app/Event/page.tsx`

**Purpose:** Displays a beautifully designed event ticket with QR code.

**Props:**
```typescript
interface Registration {
  name: string;
  username: string;
  type: string;
  eventName: string;
  eventTime: string;
  teamName: string;
  referenceId: string;
  link: string;
  day: string;
}
```

**Features:**
- Background video/image support
- QR code generation
- Download as PNG functionality
- Responsive design
- Custom branding (logo, colors)

**Usage:**
```tsx
import EventCard from '@/app/Event/page';

<EventCard />
```

### 2. QRScanner Component

**Location:** `src/app/components/QRScanner.tsx`

**Purpose:** Camera-based QR code scanner with visual feedback.

**Props:**
```typescript
interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}
```

**Features:**
- Decorative corner borders
- Loading states
- Scanning animation
- Torch/flashlight support
- Zoom controls
- Instructions display
- Rescan functionality

**Usage:**
```tsx
import QRScanner from '@/app/components/QRScanner';

<QRScanner
  onScanSuccess={(text) => console.log('Scanned:', text)}
  onScanError={(error) => console.error('Error:', error)}
/>
```

### 3. Scanner Page

**Location:** `src/app/scanner/page.tsx`

**Purpose:** Complete verification interface with scanner and results.

**Features:**
- Sticky header with status badge
- Scanner integration
- Loading states
- Success/error animations
- Detailed ticket information
- Toast notifications
- Mobile-responsive layout

**Routes:**
- `/scanner` - Main scanner interface

### 4. Test QR Page

**Location:** `src/app/test-qr/page.tsx`

**Purpose:** Generate test QR codes for development and testing.

**Features:**
- Display test QR code
- Show test data
- Instructions for testing
- Quick links to scanner
- Mobile-responsive

**Routes:**
- `/test-qr` - Test QR code generator

---

## API Documentation

### POST /api/verify

Verifies a ticket by reference ID and marks it as verified.

**Endpoint:** `/api/verify`

**Method:** `POST`

**Request Body:**
```json
{
  "referenceId": "4234567890"
}
```

**Response (Success - First Verification):**
```json
{
  "success": true,
  "message": "Registration verified successfully",
  "data": {
    "referenceId": "4234567890",
    "name": "John Doe",
    "username": "johndoe",
    "type": "Visitor",
    "eventName": "Techfest",
    "eventTime": "10:00 AM - 5:00 PM",
    "teamName": "Team Alpha",
    "day": "Day 1",
    "verified": true
  }
}
```

**Response (Already Verified):**
```json
{
  "success": false,
  "message": "Ticket already verified",
  "error": "ALREADY_VERIFIED",
  "data": {
    "referenceId": "4234567890",
    "name": "John Doe",
    "username": "johndoe",
    "type": "Visitor",
    "eventName": "Techfest",
    "eventTime": "10:00 AM - 5:00 PM",
    "teamName": "Team Alpha",
    "day": "Day 1",
    "verified": true
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Registration not found",
  "error": "INVALID_REFERENCE_ID"
}
```

**Error Codes:**
- `INVALID_REFERENCE_ID` - Reference ID doesn't exist in database
- `ALREADY_VERIFIED` - Ticket has been previously verified
- `INVALID_FORMAT` - QR code format is invalid
- `NETWORK_ERROR` - Network connection failed

---

## Database Schema

### Supabase Setup

Run this SQL in your Supabase SQL Editor:

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

-- Create indexes
CREATE INDEX idx_reference_id ON registrations(reference_id);
CREATE INDEX idx_user_id ON registrations(user_id);
CREATE INDEX idx_verified ON registrations(verified);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registrations"
  ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow verification checks"
  ON registrations FOR SELECT
  USING (true);

CREATE POLICY "Allow verification updates"
  ON registrations FOR UPDATE
  USING (true)
  WITH CHECK (verified = true);

-- Auto-generate reference ID
CREATE OR REPLACE FUNCTION generate_reference_id()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 10000000000)::TEXT, 10, '0');
END;
$$ LANGUAGE plpgsql;

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

### Schema Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `name` | TEXT | Full name of attendee |
| `username` | TEXT | Display username |
| `type` | TEXT | Ticket type (Visitor, VIP, etc.) |
| `event_name` | TEXT | Event name |
| `event_time` | TEXT | Event time slot |
| `team_name` | TEXT | Team or group name |
| `reference_id` | TEXT | Unique booking ID (auto-generated) |
| `day` | TEXT | Event day (Day 1, Day 2, etc.) |
| `verified` | BOOLEAN | Verification status |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

---

## Usage Guide

### For Event Organizers

#### 1. Generate Tickets

Create registrations in your database:

```typescript
import { supabase } from '@/lib/supabase';

const createRegistration = async (userData) => {
  const { data, error } = await supabase
    .from('registrations')
    .insert([
      {
        user_id: userData.userId,
        name: userData.name,
        username: userData.username,
        type: 'Visitor',
        event_name: 'Techfest 2026',
        event_time: '10:00 AM - 5:00 PM',
        team_name: userData.teamName,
        day: 'Day 1',
      }
    ])
    .select()
    .single();

  return data;
};
```

#### 2. Display Tickets

Show tickets to users on their profile page or send via email.

#### 3. Verify at Entry

Use the scanner page (`/scanner`) at event entry points:
- Open scanner on tablet/phone
- Scan attendee's QR code
- View verification result
- Allow/deny entry based on result

### For Attendees

#### 1. View Ticket

Navigate to profile page to see your ticket.

#### 2. Download Ticket

Click "Download Ticket" button to save as PNG.

#### 3. Present at Entry

Show QR code to event staff for scanning.

### For Developers

#### Testing Workflow

1. **Generate Test QR Code**
   - Visit `/test-qr`
   - View test QR code with dummy data

2. **Test Scanner**
   - Open `/scanner` on another device or tab
   - Scan the test QR code
   - Verify results display correctly

3. **Test Verification**
   - First scan: Should verify successfully
   - Second scan: Should show "Already verified"
   - Invalid QR: Should show error

---

## Customization

### Ticket Design

Edit `src/app/Event/page.tsx`:

```tsx
// Change colors
<div className="bg-[#YOUR_COLOR] rounded-[20px] p-1">

// Change logo
<Image src="/your-logo.png" alt="Logo" width={50} height={50} />

// Change event branding
<h1 className="text-md">Your Event Name</h1>

// Customize QR size
<QRCodeCanvas value={link} size={200} />
```

### Scanner Colors

Edit `src/app/components/QRScanner.tsx`:

```tsx
// Change accent color
<div className="border-[#YOUR_COLOR]">

// Change shadows
shadow-[0px_0px_30px_5px_rgba(YOUR_RGB,0.3)]
```

### Toast Styling

Edit `src/app/scanner/page.tsx`:

```tsx
<Toaster
  toastOptions={{
    style: {
      background: '#YOUR_BG',
      border: '1px solid #YOUR_BORDER',
      color: '#YOUR_TEXT',
    },
  }}
/>
```

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables

3. **Environment Variables**
   Add these in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

### Custom Server

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Troubleshooting

### QR Scanner Issues

**Problem:** Camera not working

**Solutions:**
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions
- Try different browser (Chrome recommended)
- Use a different device

**Problem:** Scanner not detecting QR code

**Solutions:**
- Ensure good lighting
- Hold device steady
- Adjust distance from QR code
- Clean camera lens
- Try different QR code size

### Verification Issues

**Problem:** "Registration not found"

**Solutions:**
- Check reference ID in database
- Verify QR code format
- Check API endpoint is running
- Review database connection

**Problem:** Network errors

**Solutions:**
- Check internet connection
- Verify API endpoint URL
- Check CORS settings
- Review server logs

### Database Issues

**Problem:** Connection failed

**Solutions:**
- Verify environment variables
- Check Supabase project status
- Review RLS policies
- Check database credentials

**Problem:** Permission denied

**Solutions:**
- Review RLS policies
- Check user authentication
- Verify user_id matching
- Check database roles

### Build Issues

**Problem:** Build fails

**Solutions:**
- Clear `.next` folder
- Delete `node_modules` and reinstall
- Check TypeScript errors
- Verify all imports

---

## Best Practices

### Security

1. **Always use HTTPS** in production
2. **Enable RLS** on all tables
3. **Validate input** on API endpoints
4. **Rate limit** verification endpoint
5. **Log all verifications** for audit trail

### Performance

1. **Optimize images** (use Next.js Image component)
2. **Cache QR codes** when possible
3. **Use indexes** on database queries
4. **Implement pagination** for large datasets
5. **Compress assets** before deployment

### User Experience

1. **Provide clear feedback** (use toasts)
2. **Handle errors gracefully**
3. **Support offline mode** when possible
4. **Test on multiple devices**
5. **Optimize for mobile first**

---

## Support & Contributing

For issues, questions, or contributions:
- Open an issue on GitHub
- Submit a pull request
- Contact the maintainers

---

## License

MIT License - See LICENSE file for details

---

## Changelog

### Version 1.0.0 (2026-01-20)

**Features:**
- Initial release
- QR code generation and scanning
- Ticket verification system
- Mobile-first design
- Supabase integration
- Toast notifications
- Test QR code generator
- Download ticket functionality

**Tech Stack:**
- Next.js 16.1.1
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- html5-qrcode 2.3.8
- qrcode.react 4.2.0
- sonner (latest)

---

Made with ❤️ using Next.js and Supabase 
