import { motion } from 'framer-motion'
import OtpInput from '../../components/OtpInput'
import { useAuthStore } from '../../store/authStore'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'



const VerifyEmailPage = () => {
    const { verifyEmail, isLoading } = useAuthStore()
    const navigate = useNavigate()
    
    const handleSubmit = (value: string) => {
       verifyEmail(value).then(() => {
        navigate('/auth/sign-in');
        toast.success('Email verified successfully! Redirecting to sign in page...');
       }).catch(() => {
        toast.error('Email verification failed! Please try again.');
       });
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
        Verify Your Email
      </h2>
      <p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your mail address.</p>
      <OtpInput length={6} onSubmit={handleSubmit} isLoading={isLoading} />
     </div>
    </motion.div>   
  )
}

export default VerifyEmailPage