import React from 'react'
import type { LucideIcon } from 'lucide-react'

type Props = {
    Icon: LucideIcon;
    type?: string;
    className?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
}

const Input = ({ Icon, type, className, placeholder, value, onChange, name }: Props) => {
  return (
    <div className='relative mb-6'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Icon className='size-5 text-green-400' />
        </div>
        <input 
        type={type} className={`w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 transition-duration-200 ${className}`} placeholder={placeholder}  value={value} onChange={onChange} name={name} />
    </div>
  )
}

export default Input