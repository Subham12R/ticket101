import { NextRequest, NextResponse } from 'next/server';

// Mock database - In production, replace this with your actual database
const registrations = [
  {
    referenceId: "4234567890",
    name: "Subham Karmakar",
    username: "Subham K",
    type: "Visitor",
    eventName: "Techfest",
    eventTime: "10:00 AM - 5:00 PM",
    teamName: "Team Alpha",
    day: "Day 1",
    verified: false,
  },
  // Add more mock registrations here
];

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

    // Find the registration in the mock database
    const registration = registrations.find(
      (reg) => reg.referenceId === referenceId
    );

    if (!registration) {
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
          data: registration,
        },
        { status: 200 }
      );
    }

    // Mark as verified
    registration.verified = true;

    return NextResponse.json(
      {
        success: true,
        message: 'Registration verified successfully',
        data: registration,
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
