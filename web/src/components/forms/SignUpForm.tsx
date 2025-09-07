import React, { useState } from 'react'
import Input from '../Input'
import { Lock, Mail, User, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import PasswordStrengthMeter from '../PasswordStrenghtMeter'

export interface SignUpFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

type Props = {
    onSubmit: (data: SignUpFormData) => void
    isLoading: boolean
}

const SignUpForm = ({ onSubmit, isLoading }: Props) => {
    const [formData, setFormData] = useState<SignUpFormData>({
        name: '',
        email: '',
        password: '',
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
            <Input Icon={User} type='text' placeholder='Full Name' value={formData.name} onChange={onChange} name='name' />
            <Input Icon={Mail} type='email' placeholder='Email Address' value={formData.email} onChange={onChange} name='email' />
            <Input Icon={Lock} type='password' placeholder='Password' value={formData.password} onChange={onChange} name='password' />
            <Input Icon={Lock} type='password' placeholder='Confirm Password' value={formData.confirmPassword} onChange={onChange} name='confirmPassword' />

            {/* Password Strength Meter */}
            <PasswordStrengthMeter password={formData.password} confirmPassword={formData.confirmPassword} />

            <motion.button
                type='submit'
                className='w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-emerald-500 hover:to-green-400 transition-duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
            >
                {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : 'Sign Up'}
            </motion.button>
        </form>
    )
}

export default SignUpForm