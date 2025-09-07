import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getAuthStatus, logAuthTiming } from '@/lib/utils/authTiming';
import { cn } from '@/lib/utils';

interface AuthTimingDebugProps {
    className?: string;
    showInProduction?: boolean;
}

/**
 * Debug component to show authentication timing information
 * Only shows in development unless showInProduction is true
 */
export const AuthTimingDebug: React.FC<AuthTimingDebugProps> = ({
    className,
    showInProduction = false
}) => {
    const [status, setStatus] = useState(getAuthStatus());
    const { forceAuthCheck } = useAuth();

    // Update status every second
    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(getAuthStatus());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Don't show in production unless explicitly requested
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
        return null;
    }

    const handleForceCheck = () => {
        forceAuthCheck();
        logAuthTiming();
    };

    return (
        <div className={cn(
            'fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50',
            'border border-gray-600 shadow-lg max-w-sm',
            className
        )}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-green-400">🔐 Auth Timing</h3>
                <button
                    onClick={handleForceCheck}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                >
                    Force Check
                </button>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={status.isAuthenticated ? 'text-green-400' : 'text-red-400'}>
                        {status.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Next Check:</span>
                    <span className={status.isNearExpiry ? 'text-yellow-400' : 'text-white'}>
                        {status.nextCheckIn}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Interval:</span>
                    <span className="text-white">{status.intervalMinutes}m</span>
                </div>

                {status.lastAuthCheck && (
                    <div className="flex justify-between">
                        <span className="text-gray-400">Last Check:</span>
                        <span className="text-white text-xs">
                            {status.lastAuthCheck.toLocaleTimeString()}
                        </span>
                    </div>
                )}

                {status.isNearExpiry && (
                    <div className="text-yellow-400 text-xs mt-2 p-1 bg-yellow-900/30 rounded">
                        ⚠️ Auth check due soon
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthTimingDebug;
