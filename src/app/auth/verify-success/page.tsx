'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function VerifySuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const email = searchParams?.get('email') ?? null;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Only start countdown if we have a valid countdown value
    if (countdown > 0) {
      timeoutId = setTimeout(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Use setTimeout to ensure navigation happens after state update
            setTimeout(() => {
              router.push('/login');
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [countdown, router]);

  const handleManualNavigation = () => {
    setCountdown(0); // Stop the countdown
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Email Verified Successfully!
          </h1>
          {email && (
            <p className="text-gray-600">
              Your email address <span className="font-medium">{email}</span> has been verified.
            </p>
          )}
          <p className="text-gray-600">
            You can now log in to your account and access all features.
          </p>
          <div className="space-y-4 w-full">
            <Button
              onClick={handleManualNavigation}
              className="w-full"
            >
              Go to Login
            </Button>
            {countdown > 0 && (
              <p className="text-sm text-gray-500">
                Redirecting to login page in {countdown} seconds...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 