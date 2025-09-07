import { CheckIcon, XIcon } from "lucide-react";
import { useMemo } from "react";

const PasswordCriteria = ({ password, confirmPassword }: { password: string, confirmPassword: string }) => {
    const criteria = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains at least one uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains at least one lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains at least one number", met: /[0-9]/.test(password) },
        { label: "Contains at least one special character", met: /[!@#$%^&*]/.test(password) },
        { label: "Passwords match", met: password === confirmPassword && (password !== '' && confirmPassword !== '') }
    ]

    return (
        <div className="my-2 space-y-1">
            {criteria.map((criterion, index) => (
                <div key={index} className="flex items-center text-sm">
                    {criterion.met ? <CheckIcon className="w-4 h-4 text-green-500" /> : <XIcon className="w-4 h-4 text-red-500" />}
                    <p className={`ml-2 ${criterion.met ? 'text-green-500' : 'text-gray-400'}`}>{criterion.label}</p>
                </div>
            ))}
        </div>
    )
};

const PasswordStrengthMeter = ({ password, confirmPassword }: { password: string, confirmPassword: string }) => {

    const passwordStrenght = useMemo(() => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[!@#$%^&*]/.test(password)) strength += 1;
        if (confirmPassword === password && (password !== '' && confirmPassword !== '')) strength += 1;
        return strength;
    }, [password, confirmPassword])

    const passwordStrengthLevel = useMemo(() => {
        if (passwordStrenght === 0) return 'weak';
        if (passwordStrenght === 1) return 'fair';
        if (passwordStrenght === 2) return 'medium';
        if (passwordStrenght === 3) return 'strong';
        return 'very strong';
    }, [passwordStrenght])

    const passwordStrengthColor = useMemo(() => {
        if (passwordStrenght === 0) return 'bg-red-500';
        if (passwordStrenght === 1) return 'bg-orange-500';
        if (passwordStrenght === 2) return 'bg-yellow-500';
        if (passwordStrenght === 3) return 'bg-yellow-400';
        return 'bg-green-500';
    }, [passwordStrenght])

    return (
        <div className="my-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400 pr-1">Password Strength:</span>
                <span className="text-sm text-gray-400 capitalize">{passwordStrengthLevel}</span>
            </div>
            <div className='flex space-x-1'>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className={`w-1/4 h-1 rounded-full transition-colors duration-500 ease-in-out ${passwordStrenght >= index + 1 ? passwordStrengthColor : 'bg-gray-600'}`}/>
                ))}
            </div>
            <PasswordCriteria password={password} confirmPassword={confirmPassword} />
        </div>
    )
}

export default PasswordStrengthMeter;