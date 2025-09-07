import React, { useState } from 'react'
import Input from '../Input'
import { Lock, Mail, Loader } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'


export interface SignInFormData {
    email: string
    password: string
}

type Props = {
    onSubmit: (data: SignInFormData) => Promise<void>
    isLoading: boolean
}

const SignInForm = ({ onSubmit, isLoading }: Props) => {
    const [formData, setFormData] = useState<SignInFormData>({
        email: '',
        password: ''
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
            <Input Icon={Mail} type='email' placeholder='Email Address' value={formData.email} onChange={onChange} name='email' />
            <Input Icon={Lock} type='password' placeholder='Password' value={formData.password} onChange={onChange} name='password' />
            <div className='flex justify-end mb-6'>
                <Link to="/auth/password/forgot" className='text-green-400 hover:underline transition-duration-200 ease-in-out'>Forgot Password?</Link>
            </div>

            <motion.button type='submit' className='w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-emerald-500 hover:to-green-400 transition-duration-200 cursor-pointer flex items-center justify-center gap-2' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isLoading}>
                {isLoading ? <Loader className='size-4 animate-spin' /> : 'Sign In'}
            </motion.button>
        </form>
    )
}

export default SignInForm