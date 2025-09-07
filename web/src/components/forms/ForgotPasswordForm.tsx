import React, { useState } from 'react'
import type { ForgotPasswordFormData } from '@/lib/types'
import Input from '../Input'
import { Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'

type Props = {
    onSubmit: (data: ForgotPasswordFormData) => Promise<void>
    isLoading: boolean
}

const ForgotPasswordForm = ({ onSubmit, isLoading }: Props) => {

    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: ''
    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await onSubmit(formData);
    }

    return (
        <form onSubmit={handleSubmit} className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Input Icon={Mail} type='email' placeholder='Email Address' value={formData.email} onChange={onChange} name='email' />
            <motion.button type='submit' className='w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-emerald-500 hover:to-green-400 transition-duration-200 cursor-pointer flex items-center justify-center gap-2' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isLoading}>
                {isLoading ? <Loader className='size-4 animate-spin' /> : 'Forgot Password'}
            </motion.button>
        </form>
    )
}

export default ForgotPasswordForm