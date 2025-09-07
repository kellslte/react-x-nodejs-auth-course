import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'dots' | 'pulse' | 'bounce' | 'wave';
    color?: 'primary' | 'secondary' | 'accent' | 'white' | 'gray';
    className?: string;
    text?: string;
    showText?: boolean;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    accent: 'text-green-600',
    white: 'text-white',
    gray: 'text-gray-600',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    variant = 'default',
    color = 'primary',
    className,
    text,
    showText = false,
}) => {
    const spinnerVariants = {
        default: {
            animate: {
                rotate: 360,
            },
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
            },
        },
        pulse: {
            animate: {
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
            },
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
        bounce: {
            animate: {
                y: [0, -20, 0],
            },
            transition: {
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    const renderSpinner = () => {
        switch (variant) {
            case 'dots':
                return (
                    <div className="flex space-x-1">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                className={`w-2 h-2 rounded-full bg-current ${colorClasses[color]}`}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: index * 0.2,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </div>
                );

            case 'wave':
                return (
                    <div className="flex space-x-1">
                        {[0, 1, 2, 3, 4].map((index) => (
                            <motion.div
                                key={index}
                                className={`w-1 h-6 rounded-full bg-current ${colorClasses[color]}`}
                                animate={{
                                    scaleY: [1, 2, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: index * 0.1,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </div>
                );

            case 'pulse':
                return (
                    <motion.div
                        className={`rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
                        variants={spinnerVariants.pulse}
                        animate="animate"
                    />
                );

            case 'bounce':
                return (
                    <motion.div
                        className={`rounded-full bg-current ${sizeClasses[size]} ${colorClasses[color]}`}
                        variants={spinnerVariants.bounce}
                        animate="animate"
                    />
                );

            default:
                return (
                    <motion.div
                        className={`rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
                        variants={spinnerVariants.default}
                        animate="animate"
                    />
                );
        }
    };

    return (
        <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
            <div className="relative">
                {renderSpinner()}

                {/* Optional inner glow effect */}
                {variant === 'default' && (
                    <motion.div
                        className={`absolute inset-0 rounded-full border border-current opacity-20 ${sizeClasses[size]}`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                )}
            </div>

            {showText && text && (
                <motion.p
                    className={`text-sm font-medium ${colorClasses[color]}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
};

// Preset loading spinners for common use cases
export const LoadingSpinnerPresets = {
    // Full page loading
    PageLoader: () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 fixed inset-0 flex items-center justify-center z-50">
            <LoadingSpinner
                size="xl"
                variant="default"
                color="primary"
                text="Loading..."
                showText
                className="bg-white rounded-lg p-8 shadow-lg"
            />
        </div>
    ),

    // Button loading
    ButtonLoader: () => (
        <LoadingSpinner
            size="sm"
            variant="default"
            color="white"
        />
    ),

    // Card loading
    CardLoader: () => (
        <div className="flex items-center justify-center p-8">
            <LoadingSpinner
                size="lg"
                variant="pulse"
                color="primary"
                text="Loading content..."
                showText
            />
        </div>
    ),

    // Inline loading
    InlineLoader: () => (
        <LoadingSpinner
            size="sm"
            variant="dots"
            color="gray"
        />
    ),

    // Auth loading
    AuthLoader: () => (
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <LoadingSpinner
                size="lg"
                variant="wave"
                color="primary"
                text="Authenticating..."
                showText
            />
        </div>
    ),
};

export default LoadingSpinner;
