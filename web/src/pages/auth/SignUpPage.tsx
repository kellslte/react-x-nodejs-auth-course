import { motion } from 'framer-motion'
import SignUpForm from '../../components/forms/SignUpForm'
import { Link, useNavigate } from 'react-router'
import type { SignUpFormData } from '../../components/forms/SignUpForm'
import { useAuthStore } from '../../store/authStore'
import { useEffect } from 'react'
import { toast } from 'sonner'

const SignUpPage = () => {
    const { signUp, isLoading, error } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);


    const handleSubmit = (data: SignUpFormData) => {
        signUp(data).then(() => {
            toast.success('Account created successfully! Please check your email for verification.');
            !isLoading && navigate('/auth/verify-email');
        }).catch(() => {
            toast.error('Account creation failed! Please try again.');
            // console.error(e);
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                <h1 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                    Create Account
                </h1>
                <SignUpForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className='text-gray-400 text-sm'>
                    Already have an account? <Link to="/auth/sign-in" className='text-green-400 hover:underline transition-duration-200 ease-in-out'>Sign In</Link>
                </p>
            </div>
        </motion.div>
    )
}

export default SignUpPage