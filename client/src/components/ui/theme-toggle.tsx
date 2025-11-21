import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (stored) {
      setIsDark(stored === "dark");
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="w-9 h-9 rounded-full p-0"
      aria-label={isDark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن"}
    >
      <motion.div
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isDark ? (
          <i className="fas fa-sun text-yellow-500"></i>
        ) : (
          <i className="fas fa-moon text-blue-600"></i>
        )}
      </motion.div>
    </Button>
  );
}