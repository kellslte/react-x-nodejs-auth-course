import { motion } from 'framer-motion'
import SignInForm from '../../components/forms/SignInForm'
import type { SignInFormData } from '../../components/forms/SignInForm'
import { Link, useNavigate } from 'react-router'
import { useAuthActions } from '../../lib/hooks/useAuthActions'
import { toast } from 'sonner'

const SignInPage = () => {
  const { signIn, isLoading } = useAuthActions()
  const navigate = useNavigate()

  const handleSubmit = async (data: SignInFormData) => {
    const result = await signIn(data);

    if (result.success) {
      toast.success('Signed in successfully! Redirecting to home page...');
      navigate('/');
    } else {
      toast.error(result.error || 'Sign in failed! Please try again.');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
      <div className="p-8">
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
          Welcome Back
        </h2>
        <SignInForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className='text-gray-400 text-sm'>
          Don&apos;t have an account? <Link to="/auth/sign-up" className='text-green-400 hover:underline transition-duration-200 ease-in-out'>Sign Up</Link>
        </p>
      </div>
    </motion.div>
  )
}

export default SignInPage