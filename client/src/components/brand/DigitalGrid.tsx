import { motion } from 'framer-motion';

interface DigitalGridProps {
  className?: string;
}

export function DigitalGrid({ className = "" }: DigitalGridProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgb(14 165 233) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}