import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AuthDebugPanelProps {
    className?: string;
    showInProduction?: boolean;
}

/**
 * Debug panel to monitor authentication behavior
 * Shows when auth checks are happening and why
 */
export const AuthDebugPanel: React.FC<AuthDebugPanelProps> = ({
    className,
    showInProduction = false
}) => {
    const location = useLocation();
    const { isAuthenticated, isCheckingAuth, lastAuthCheck, authCheckInterval } = useAuthStore();
    const { isInitialized, shouldCheckAuth } = useAuthContext();
    const [logs, setLogs] = useState<string[]>([]);

    // Don't show in production unless explicitly requested
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
        return null;
    }

    // Add log entry
    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
    };

    // Monitor auth check triggers
    useEffect(() => {
        const isAuthRoute = location.pathname.startsWith('/auth/');
        const isProtectedRoute = location.pathname === '/' || location.pathname.startsWith('/dashboard');

        addLog(`Route: ${location.pathname} | Auth Route: ${isAuthRoute} | Protected: ${isProtectedRoute}`);
    }, [location.pathname]);

    useEffect(() => {
        if (isCheckingAuth) {
            addLog('🔍 Auth check started');
        } else {
            addLog('✅ Auth check completed');
        }
    }, [isCheckingAuth]);

    useEffect(() => {
        if (isInitialized) {
            addLog('🚀 Auth context initialized');
        }
    }, [isInitialized]);

    const getTimeUntilNextCheck = () => {
        if (!lastAuthCheck) return 'Never';
        const timePassed = Date.now() - lastAuthCheck;
        const timeRemaining = Math.max(0, authCheckInterval - timePassed);
        const minutes = Math.floor(timeRemaining / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className={cn(
            'fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm max-h-96 overflow-y-auto',
            'border border-gray-600 shadow-lg',
            className
        )}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-green-400">🔐 Auth Debug</h3>
                <button
                    onClick={() => setLogs([])}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                    Clear
                </button>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-400">Route:</span>
                    <span className="text-white">{location.pathname}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Authenticated:</span>
                    <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
                        {isAuthenticated ? 'Yes' : 'No'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Checking:</span>
                    <span className={isCheckingAuth ? 'text-yellow-400' : 'text-gray-400'}>
                        {isCheckingAuth ? 'Yes' : 'No'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Initialized:</span>
                    <span className={isInitialized ? 'text-green-400' : 'text-yellow-400'}>
                        {isInitialized ? 'Yes' : 'No'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Should Check:</span>
                    <span className={shouldCheckAuth ? 'text-yellow-400' : 'text-gray-400'}>
                        {shouldCheckAuth ? 'Yes' : 'No'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Next Check:</span>
                    <span className="text-white">{getTimeUntilNextCheck()}</span>
                </div>
            </div>

            <div className="border-t border-gray-600 pt-2">
                <h4 className="text-gray-400 mb-2">Recent Activity:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                    {logs.map((log, index) => (
                        <div key={index} className="text-xs text-gray-300 break-words">
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthDebugPanel;
