import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Zap, Rocket, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotFoundVariantProps {
  variant?: 'minimal' | 'space' | 'tech' | 'nature';
  className?: string;
}

const NotFoundVariants: React.FC<NotFoundVariantProps> = ({ 
  variant = 'minimal',
  className 
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate('/');

  const variants = {
    minimal: {
      bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
      textColor: 'text-gray-800',
      accentColor: 'text-blue-600',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700',
      icon: Search,
      message: "The page you're looking for doesn't exist.",
      fact: "404 errors were first recorded at CERN in 1992!"
    },
    space: {
      bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
      textColor: 'text-white',
      accentColor: 'text-yellow-400',
      buttonStyle: 'bg-yellow-400 hover:bg-yellow-500 text-black',
      icon: Rocket,
      message: "Houston, we have a problem! This page is lost in space.",
      fact: "The first 404 error was found in a room numbered 404 at CERN!"
    },
    tech: {
      bg: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900',
      textColor: 'text-green-100',
      accentColor: 'text-green-400',
      buttonStyle: 'bg-green-500 hover:bg-green-600',
      icon: Zap,
      message: "Error 404: Page not found in the digital matrix.",
      fact: "404 errors are so common, they have their own Wikipedia page!"
    },
    nature: {
      bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
      textColor: 'text-green-800',
      accentColor: 'text-emerald-600',
      buttonStyle: 'bg-emerald-600 hover:bg-emerald-700',
      icon: Compass,
      message: "This page has wandered off the beaten path into the digital wilderness.",
      fact: "The term '404' comes from room 404 at CERN where the web was born!"
    }
  };

  const currentVariant = variants[variant];
  const IconComponent = currentVariant.icon;

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center px-4 relative overflow-hidden',
      currentVariant.bg,
      className
    )}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: currentVariant.accentColor.replace('text-', 'bg-') }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full opacity-30"
          style={{ backgroundColor: currentVariant.accentColor.replace('text-', 'bg-') }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className={cn(
            'text-8xl md:text-9xl font-bold leading-none',
            currentVariant.accentColor
          )}>
            404
          </h1>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center shadow-lg',
              currentVariant.buttonStyle
            )}
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <IconComponent className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className={cn(
            'text-2xl md:text-3xl font-bold mb-4',
            currentVariant.textColor
          )}>
            Page Not Found
          </h2>
          <p className={cn(
            'text-lg md:text-xl leading-relaxed',
            currentVariant.textColor,
            'opacity-80'
          )}>
            {currentVariant.message}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoHome}
            className={cn(
              'group flex items-center gap-2 px-6 py-3 text-white font-semibold',
              'rounded-lg shadow-lg hover:shadow-xl transition-all duration-300',
              'focus:outline-none focus:ring-4 focus:ring-opacity-50',
              currentVariant.buttonStyle
            )}
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Go Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className={cn(
              'group flex items-center gap-2 px-6 py-3 font-semibold rounded-lg',
              'shadow-lg hover:shadow-xl transition-all duration-300',
              'focus:outline-none focus:ring-4 focus:ring-opacity-50',
              variant === 'space' || variant === 'tech' 
                ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            )}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className={cn(
            'mt-12 p-4 rounded-xl shadow-lg max-w-xl mx-auto',
            variant === 'space' || variant === 'tech'
              ? 'bg-white/10 backdrop-blur-sm border border-white/20'
              : 'bg-white/50 backdrop-blur-sm'
          )}
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-xl"
            >
              {variant === 'space' ? '🚀' : variant === 'tech' ? '⚡' : variant === 'nature' ? '🌿' : '🤔'}
            </motion.div>
            <div>
              <h3 className={cn(
                'font-semibold mb-1',
                currentVariant.textColor
              )}>
                Did you know?
              </h3>
              <p className={cn(
                'text-sm',
                currentVariant.textColor,
                'opacity-80'
              )}>
                {currentVariant.fact}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundVariants;
