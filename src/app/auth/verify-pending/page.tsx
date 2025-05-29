'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function VerifyPendingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  const handleResendVerification = async () => {
    if (!session?.user?.email) return;
    
    setIsResending(true);
    setResendStatus('idle');
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });
      
      if (response.ok) {
        setResendStatus('success');
      } else {
        setResendStatus('error');
      }
    } catch (error) {
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Mail className="h-16 w-16 text-blue-500" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            Please check your email ({session.user.email}) and click the verification link to continue.
          </p>
          <div className="space-y-2">
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
            {resendStatus === 'success' && (
              <p className="text-sm text-green-600">
                Verification email sent successfully!
              </p>
            )}
            {resendStatus === 'error' && (
              <p className="text-sm text-red-600">
                Failed to resend verification email. Please try again.
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/login')}
            className="mt-4"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
} 