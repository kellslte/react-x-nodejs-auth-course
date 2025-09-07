
import ResetPasswordForm from '@/components/forms/ResetPasswordForm'
import { useAuthActions } from '@/lib/hooks/useAuthActions'
import { toast } from 'sonner'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { ResetPasswordFormData } from '@/lib/types'
import { motion } from 'framer-motion'

const ResetPasswordPage = () => {
  const { resetPassword, isLoading } = useAuthActions()
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()

  const handleSubmit = async (data: ResetPasswordFormData) => {
    const result = await resetPassword(token!, data)
    if (result.success) {
      toast.success(result.message)
      navigate('/auth/sign-in')
    } else {
      toast.error(result.message)
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
          Reset Password
        </h2>
        <ResetPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />

      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <motion.p whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='mr-2 text-green-400 text-sm flex items-center gap-2'>
          <ArrowLeft className='w-4 h-4' />
          <Link to="/auth/sign-in" className='hover:underline transition-duration-200 ease-in-out'>Back to Login</Link>
        </motion.p>
      </div>
    </motion.div>
  )
}

export default ResetPasswordPage