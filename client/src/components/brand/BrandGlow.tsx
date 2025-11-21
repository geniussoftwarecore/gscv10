import { motion } from 'framer-motion';

interface BrandGlowProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandGlow({ className = "", size = 'md' }: BrandGlowProps) {
  const sizeClasses = {
    sm: 'h-32 w-32',
    md: 'h-40 w-40 md:h-56 md:w-56',
    lg: 'h-56 w-56 md:h-72 md:w-72',
  };

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-r from-sky-200/30 via-sky-300/20 to-sky-400/30 rounded-full blur-2xl`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`absolute ${sizeClasses[size]} bg-gradient-to-br from-sky-100/40 via-white/20 to-sky-200/30 rounded-full blur-3xl`}
        animate={{ 
          rotate: 360,
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </div>
  );
}