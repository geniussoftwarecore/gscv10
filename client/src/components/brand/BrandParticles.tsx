import { motion } from 'framer-motion';

interface BrandParticlesProps {
  className?: string;
}

export function BrandParticles({ className = "" }: BrandParticlesProps) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4, // 4-12px
    x: Math.random() * 400 - 200, // -200 to 200
    y: Math.random() * 400 - 200, // -200 to 200
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4, // 3-7 seconds
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-sky-400/20 rounded-sm"
          style={{
            width: particle.size,
            height: particle.size,
            left: `50%`,
            top: `50%`,
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [particle.x, particle.x + 20, particle.x - 15, particle.x],
            y: [particle.y, particle.y - 30, particle.y + 10, particle.y],
            opacity: [0, 0.6, 0.3, 0],
            scale: [0, 1, 1.2, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}