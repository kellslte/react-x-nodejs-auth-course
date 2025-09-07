import type { ResetPasswordFormData } from '@/lib/types'
import React, { useState } from 'react'
import Input from '../Input'
import { motion } from 'framer-motion'
import { Loader, Lock } from 'lucide-react'

type Props = {
    onSubmit: (data: ResetPasswordFormData) => Promise<void>
    isLoading: boolean
}

const ResetPasswordForm = ({ onSubmit, isLoading }: Props) => {
    const [formData, setFormData] = useState<ResetPasswordFormData>({
        newPassword: '',
        confirmPassword: ''
    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await onSubmit(formData)
    }

    
    return (
        <form onSubmit={handleSubmit} className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Input Icon={Lock} type='password' placeholder='Password' value={formData.newPassword} onChange={onChange} name='newPassword' />
            <Input Icon={Lock} type='password' placeholder='Confirm Password' value={formData.confirmPassword} onChange={onChange} name='confirmPassword' />
            <motion.button type='submit' className='w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-emerald-500 hover:to-green-400 transition-duration-200 cursor-pointer flex items-center justify-center gap-2' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isLoading}>
                {isLoading ? <Loader className='size-4 animate-spin' /> : 'Reset Password'}
            </motion.button>
        </form>
    )
}

export default ResetPasswordForm