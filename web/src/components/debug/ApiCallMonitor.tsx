import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ApiCallMonitorProps {
    className?: string;
    showInProduction?: boolean;
}

/**
 * Debug component to monitor API calls
 * Shows when API calls are being made and their frequency
 */
export const ApiCallMonitor: React.FC<ApiCallMonitorProps> = ({
    className,
    showInProduction = false
}) => {
    const [apiCalls, setApiCalls] = useState<Array<{ url: string; method: string; timestamp: number }>>([]);
    const [isVisible, setIsVisible] = useState(false);

    // Don't show in production unless explicitly requested
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
        return null;
    }

    // Monitor fetch calls
    useEffect(() => {
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            const [url, options] = args;
            const method = (options?.method || 'GET').toUpperCase();
            const urlString = typeof url === 'string' ? url : url.toString();

            // Only track API calls to our backend
            if (urlString.includes('/api/v1/')) {
                setApiCalls(prev => [
                    {
                        url: urlString,
                        method,
                        timestamp: Date.now()
                    },
                    ...prev.slice(0, 19) // Keep only last 20 calls
                ]);
            }

            return originalFetch(...args);
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    const getRecentCalls = () => {
        const now = Date.now();
        const lastMinute = apiCalls.filter(call => now - call.timestamp < 60000);
        return lastMinute.length;
    };

    const getCallFrequency = () => {
        const recentCalls = getRecentCalls();
        if (recentCalls === 0) return 'No recent calls';
        if (recentCalls === 1) return '1 call in last minute';
        return `${recentCalls} calls in last minute`;
    };

    return (
        <div className={cn(
            'fixed bottom-4 left-4 z-50',
            className
        )}>
            <button
                onClick={() => setIsVisible(!isVisible)}
                className={cn(
                    'px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200',
                    isVisible
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                )}
            >
                API: {getCallFrequency()}
            </button>

            {isVisible && (
                <div className="mt-2 bg-black/90 text-white p-3 rounded-lg text-xs font-mono max-w-sm max-h-64 overflow-y-auto border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-green-400">API Calls</h3>
                        <button
                            onClick={() => setApiCalls([])}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="space-y-1">
                        {apiCalls.length === 0 ? (
                            <div className="text-gray-400">No API calls yet</div>
                        ) : (
                            apiCalls.map((call, index) => (
                                <div key={index} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-300">
                                        {call.method} {call.url.split('/api/v1')[1] || call.url}
                                    </span>
                                    <span className="text-gray-500">
                                        {new Date(call.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiCallMonitor;
