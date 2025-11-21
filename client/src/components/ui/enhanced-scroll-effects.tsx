import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

// Parallax section component
export function ParallaxSection({
  children,
  offset = 50,
  className,
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Reveal animation with custom triggers
export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  className,
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getAnimation = () => {
    switch (direction) {
      case "up":
        return {
          initial: { y: distance, opacity: 0 },
          animate: inView ? { y: 0, opacity: 1 } : { y: distance, opacity: 0 },
        };
      case "down":
        return {
          initial: { y: -distance, opacity: 0 },
          animate: inView ? { y: 0, opacity: 1 } : { y: -distance, opacity: 0 },
        };
      case "left":
        return {
          initial: { x: distance, opacity: 0 },
          animate: inView ? { x: 0, opacity: 1 } : { x: distance, opacity: 0 },
        };
      case "right":
        return {
          initial: { x: -distance, opacity: 0 },
          animate: inView ? { x: 0, opacity: 1 } : { x: -distance, opacity: 0 },
        };
      case "scale":
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 },
        };
      default:
        return {
          initial: { y: distance, opacity: 0 },
          animate: inView ? { y: 0, opacity: 1 } : { y: distance, opacity: 0 },
        };
    }
  };

  const animation = getAnimation();

  return (
    <motion.div
      ref={ref}
      initial={animation.initial}
      animate={animation.animate}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered container for multiple elements
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered counter animation
export function AnimatedCounter({
  target,
  duration = 2,
  suffix = "",
  prefix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const motionValue = useSpring(0, { stiffness: 100, damping: 30 });
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      motionValue.set(target);
    }
  }, [inView, motionValue, target]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// Floating elements animation
export function FloatingElement({
  children,
  intensity = 20,
  duration = 4,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        y: [-intensity, intensity, -intensity],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scroll-based progress animation
export function ScrollProgress({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}