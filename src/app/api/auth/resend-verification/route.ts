import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/[...nextauth]/options';
import dbConnect from '@/helpers/dbconnect';
import User from '@/models/user.model';
import VerificationToken from '@/models/verification.model';
import Settings from '@/models/settings.model';
import { sendVerificationEmail } from '@/lib/email';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('Resend verification: No session or email found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Resend verification: Attempting for email:', session.user.email);
    await dbConnect();

    // Check if email verification is required
    const settings = await Settings.findOne();
    if (!settings?.requireEmailVerification) {
      console.log('Resend verification: Email verification not required');
      return NextResponse.json(
        { error: 'Email verification is not required' },
        { status: 400 }
      );
    }

    // Get user and check if already verified
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log('Resend verification: User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.verified) {
      console.log('Resend verification: User already verified, redirecting to login');
      return NextResponse.json(
        { 
          error: 'Email already verified',
          message: 'Your email is already verified. You can log in to your account.',
          redirectTo: '/login'
        },
        { status: 400 }
      );
    }

    // Check if user has a pending verification token
    const existingToken = await VerificationToken.findOne({ userId: user._id });
    if (existingToken) {
      console.log('Resend verification: Deleting existing token');
      await VerificationToken.deleteOne({ _id: existingToken._id });
    }

    // Create new verification token
    const verificationToken = await VerificationToken.create({
      userId: user._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });
    console.log('Resend verification: Created new token, expires at:', verificationToken.expiresAt);

    // Send verification email
    const baseUrl = (() => {
      const url = process.env.NEXT_PUBLIC_APP_URL;
      if (!url) {
        console.warn('NEXT_PUBLIC_APP_URL is not set, using localhost');
        return 'http://localhost:3000';
      }
      // Ensure URL has protocol
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        console.warn('NEXT_PUBLIC_APP_URL missing protocol, adding https://');
        return `https://${url}`;
      }
      return url;
    })();

    const verificationUrl = new URL('/api/auth/verify-email', baseUrl);
    verificationUrl.searchParams.set('token', verificationToken.token);
    
    console.log('Resend verification: Base URL:', baseUrl);
    console.log('Resend verification: Full verification URL:', verificationUrl.toString());
    
    await sendVerificationEmail(user.email, verificationUrl.toString());
    console.log('Resend verification: Email sent successfully');

    return NextResponse.json({ 
      message: 'Verification email sent successfully',
      expiresAt: verificationToken.expiresAt
    });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
} 