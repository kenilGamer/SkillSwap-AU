'use client';

import { useSession } from 'next-auth/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function VerificationWarning() {
  const { data: session } = useSession();
  const router = useRouter();

  // Only show warning if user is logged in but not verified
  if (!session?.user || session.user.verified) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-1 min-w-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <p className="ml-3 text-sm text-yellow-700">
              Please verify your email address to access all features.
            </p>
          </div>
          <div className="flex-shrink-0 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/auth/verify-pending')}
              className="text-yellow-700 border-yellow-400 hover:bg-yellow-100"
            >
              Verify Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 