import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

type Props = {
    length: number
    onSubmit: (value: string) => void
    isLoading: boolean
}

const OtpInput = ({ length, onSubmit, isLoading }: Props) => {
    const [otp, setOtp] = useState<string>("")

    const handleSubmit = () => {
        onSubmit(otp)
    }

    return (
        <form className='space-y-6' onSubmit={handleSubmit}>
            <InputOTP className="flex justify-between" maxLength={length} onChange={(value: string) => setOtp(value)} onComplete={handleSubmit} >
                <InputOTPGroup className='flex justify-between w-full'>
                    <InputOTPSlot index={0} className='w-12 h-12 text-center text-2xl font-bold bg-opacity-50 border-2 border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-duration-200' />
                    <InputOTPSlot index={1} className='w-12 h-12 text-center text-2xl font-bold bg-opacity-50 border-2 border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-duration-200' />
                    <InputOTPSlot index={2} className='w-12 h-12 text-center text-2xl font-bold bg-opacity-50 border-2 border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-duration-200' />
                    <InputOTPSlot index={3} className='w-12 h-12 text-center text-2xl font-bold bg-opacity-50 border-2 border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-duration-200' />
                    <InputOTPSlot index={4} className='w-12 h-12 text-center text-2xl font-bold bg-opacity-50 border-2 border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-duration-200' />
                    <InputOTPSlot index={5} className='w-12 h-12 text-center text-2xl font-bold bg-opacity-50 border-2 border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-green-500 transition-duration-200' />
                </InputOTPGroup>
            </InputOTP>
            <motion.button
                type='submit'
                className='w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-emerald-500 hover:to-green-400 transition-duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
            >
                {isLoading ? <Loader className='size-4 animate-spin mx-auto' /> : 'Verify'}
            </motion.button>
        </form>
    )
}

export default OtpInput