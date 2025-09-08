import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { apiService } from '@/lib/api'
import { toast } from 'sonner'
import { useAuthStatus } from '@/lib/hooks/useAuthActions'

type Props = {
    children: React.ReactNode
}

const ProtectedRoutes = ({ children }: Props) => {
    const { isAuthenticated, user, isVerified } = useAuthStatus()
    const [hasSentVerification, setHasSentVerification] = useState(false)

    // Show loading while checking authentication or if not initialized
    // if (isCheckingAuth || !isInitialized) {
    //     return <LoadingSpinnerPresets.AuthLoader />
    // }

    if (!isAuthenticated) {
        return <Navigate to="/auth/sign-in" replace />
    }

    // Handle email verification - only send once
    useEffect(() => {
        if (!isVerified && user?.email && !hasSentVerification) {
            setHasSentVerification(true);
            apiService.auth.resendEmailVerification({ email: user.email })
                .then((response) => {
                    if (response.success) {
                        toast.success('Email verification link has been sent to your email')
                    }
                })
                .catch(() => {
                    toast.error('Failed to send email verification link')
                });
        }
    }, [isVerified, user?.email, hasSentVerification]);

    if (!isVerified) {
        return <Navigate to="/auth/verify-email" replace />
    }

    return children;
}

export default ProtectedRoutes