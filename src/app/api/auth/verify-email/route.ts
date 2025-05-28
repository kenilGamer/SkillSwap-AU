import { NextResponse } from 'next/server';
import dbConnect from '@/helpers/dbconnect';
import User from '@/models/user.model';
import VerificationToken from '@/models/verification.model';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      console.log('Verification attempt: No token provided');
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    console.log('Verification attempt: Token received');
    await dbConnect();

    // Find and validate the token
    const verificationToken = await VerificationToken.findOne({ token });
    if (!verificationToken) {
      console.log('Verification attempt: Invalid token');
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (verificationToken.expiresAt < new Date()) {
      console.log('Verification attempt: Token expired');
      await VerificationToken.deleteOne({ token });
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user's verified status
    const user = await User.findByIdAndUpdate(
      verificationToken.userId,
      { 
        verified: true,
        verifiedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      console.log('Verification attempt: User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the used token
    await VerificationToken.deleteOne({ token });
    console.log('Verification successful for user:', user.email);

    // Redirect to success page with a success message
    const successUrl = new URL('/auth/verify-success', request.url);
    successUrl.searchParams.set('email', user.email);
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
} 