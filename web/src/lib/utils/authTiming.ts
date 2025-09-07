import { useAuthStore } from '@/store/authStore';

/**
 * Utility functions for authentication timing management
 */

/**
 * Get the time remaining until the next authentication check
 */
export function getTimeUntilNextAuthCheck(): number {
    const { lastAuthCheck, authCheckInterval } = useAuthStore.getState();

    if (!lastAuthCheck) return 0;

    const timePassed = Date.now() - lastAuthCheck;
    return Math.max(0, authCheckInterval - timePassed);
}

/**
 * Get a human-readable string of time until next auth check
 */
export function getTimeUntilNextAuthCheckString(): string {
    const timeMs = getTimeUntilNextAuthCheck();

    if (timeMs === 0) return 'Ready to check';

    const minutes = Math.floor(timeMs / (1000 * 60));
    const seconds = Math.floor((timeMs % (1000 * 60)) / 1000);

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
}

/**
 * Check if authentication is close to expiring (within 5 minutes)
 */
export function isAuthNearExpiry(): boolean {
    const timeMs = getTimeUntilNextAuthCheck();
    return timeMs < 5 * 60 * 1000; // 5 minutes
}

/**
 * Get authentication status information
 */
export function getAuthStatus() {
    const { isAuthenticated, lastAuthCheck, authCheckInterval } = useAuthStore.getState();

    return {
        isAuthenticated,
        lastAuthCheck: lastAuthCheck ? new Date(lastAuthCheck) : null,
        nextCheckIn: getTimeUntilNextAuthCheckString(),
        isNearExpiry: isAuthNearExpiry(),
        intervalMinutes: authCheckInterval / (1000 * 60),
    };
}

/**
 * Format a timestamp for display
 */
export function formatAuthTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
}

/**
 * Debug function to log authentication timing info
 */
export function logAuthTiming() {
    const status = getAuthStatus();
    console.log('🔐 Authentication Timing Status:', {
        isAuthenticated: status.isAuthenticated,
        lastCheck: status.lastAuthCheck?.toLocaleString() || 'Never',
        nextCheckIn: status.nextCheckIn,
        isNearExpiry: status.isNearExpiry,
        intervalMinutes: status.intervalMinutes,
    });
}
