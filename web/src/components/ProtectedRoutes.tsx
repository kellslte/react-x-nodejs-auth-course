import React from 'react'
import { Navigate } from 'react-router'
import { apiService } from '@/lib/api'
import { toast } from 'sonner'
import { useAuthStatus } from '@/lib/hooks/useAuthActions'
import { useAuthContext } from '@/lib/contexts/AuthContext'
import { LoadingSpinnerPresets } from './LoadingSpinner'

type Props = {
    children: React.ReactNode
}

const ProtectedRoutes = ({ children }: Props) => {
    const { isAuthenticated, isCheckingAuth, user, isVerified } = useAuthStatus()
    const { isInitialized } = useAuthContext()

    // Show loading while checking authentication or if not initialized
    if (isCheckingAuth || !isInitialized) {
        return <LoadingSpinnerPresets.AuthLoader />
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/sign-in" replace />
    }

    if (!isVerified) {
        // send the token to the user
        apiService.auth.resendEmailVerification({ email: user?.email! }).then((response) => {
            if (response.success) {
                toast.success('Email verification link has been sent to your email')
                return <Navigate to="/auth/verify-email" replace />
            }
        }).catch(() => {
            toast.error('Email verification link has been sent to your email')
        });
    }

    return children;
}

export default ProtectedRoutes