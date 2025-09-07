import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleNotFoundProps {
  title?: string;
  message?: string;
  showButtons?: boolean;
  className?: string;
}

const SimpleNotFound: React.FC<SimpleNotFoundProps> = ({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist.",
  showButtons = true,
  className
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate('/');
  const handleRefresh = () => window.location.reload();

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4',
      className
    )}>
      <div className="text-center max-w-md mx-auto">
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-blue-600">
            404
          </h1>
        </motion.div>

        {/* Title and Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </motion.div>

        {/* Action Buttons */}
        {showButtons && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SimpleNotFound;
