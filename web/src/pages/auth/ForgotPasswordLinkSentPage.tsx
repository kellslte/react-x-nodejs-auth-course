import { motion } from "framer-motion";
import { Link, useParams } from "react-router"
import { ArrowLeft, Mail } from "lucide-react"


const ForgotPasswordLinkSentPage = () => {
    const { email } = useParams<{ email: string }>();

    return (
        <div className="text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
            >
                <div className="p-8">
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        Password Reset Link Sent
                    </h2>
                    <p className="text-gray-300 mb-6 flex items-center justify-center rounded-full bg-green-500 p-2 w-24 h-24 mx-auto">
                        <Mail size={64} />
                    </p>
                    <p className="text-gray-300 mb-6">
                        If an account exists for {email}, you will receive a password reset link shortly.
                    </p>
                </div>

                <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                    <p className="text-green-400 text-sm flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        <Link to="/auth/sign-in" className="hover:underline transition-duration-200 ease-in-out">Back to Login</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default ForgotPasswordLinkSentPage