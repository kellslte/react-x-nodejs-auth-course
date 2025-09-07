import React from 'react'
import { Navigate } from 'react-router'
import { useAuthStatus } from '@/lib/hooks/useAuthActions'

type Props = {
    children: React.ReactNode
}

const RedirectAuthenticatedUser = ({ children }: Props) => {
    const { isAuthenticated, isVerified } = useAuthStatus()

    if (isAuthenticated && isVerified) {
        return <Navigate to="/" replace />
    }

    return children
}

export default RedirectAuthenticatedUser