import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark z-50 origin-left scroll-indicator"
      style={{ scaleX }}
    />
  );
}

export function ScrollToTop() {
  const { scrollY } = useScroll();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300"
      onClick={handleScrollTop}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: scrollY.get() > 300 ? 1 : 0,
        scale: scrollY.get() > 300 ? 1 : 0,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <ArrowUp size={20} />
    </motion.button>
  );
}