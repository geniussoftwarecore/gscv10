import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

const socialPlatforms = [
  {
    name: "Facebook",
    icon: "fab fa-facebook-f",
    color: "bg-blue-600 hover:bg-blue-700",
    getUrl: (url: string, title: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
  },
  {
    name: "Twitter",
    icon: "fab fa-twitter", 
    color: "bg-sky-500 hover:bg-sky-600",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "LinkedIn",
    icon: "fab fa-linkedin-in",
    color: "bg-blue-700 hover:bg-blue-800", 
    getUrl: (url: string, title: string, description: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
  },
  {
    name: "WhatsApp",
    icon: "fab fa-whatsapp",
    color: "bg-green-500 hover:bg-green-600",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
  },
  {
    name: "Telegram",
    icon: "fab fa-telegram-plane",
    color: "bg-blue-500 hover:bg-blue-600",
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export function SocialShare({
  url = window.location.href,
  title = document.title,
  description = "شاهد هذا المحتوى المميز من Genius Software Core",
  className,
  size = "md",
  showLabels = false,
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", 
    lg: "w-12 h-12 text-lg",
  };

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    const shareUrl = platform.getUrl(url, title, description);
    window.open(shareUrl, "_blank", "width=600,height=400");
    
    // Track sharing event (you can integrate with analytics)
    toast({
      title: "تم المشاركة!",
      description: `تم مشاركة المحتوى على ${platform.name}`,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "تم النسخ!",
        description: "تم نسخ الرابط إلى الحافظة",
      });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ الرابط",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={false}
        animate={{ scale: isOpen ? 1.1 : 1 }}
        className="flex items-center gap-2"
      >
        {/* Share button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          className="relative"
        >
          <i className="fas fa-share-alt mr-2"></i>
          {showLabels && "مشاركة"}
        </Button>

        {/* Copy link button */}
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="sm"
        >
          <i className="fas fa-copy"></i>
        </Button>
      </motion.div>

      {/* Social platforms */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.8,
          y: isOpen ? 0 : -10,
        }}
        transition={{ duration: 0.2 }}
        className={`absolute top-full mt-2 flex gap-2 z-20 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {socialPlatforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isOpen ? 1 : 0,
              y: isOpen ? 0 : 10,
            }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Button
              onClick={() => handleShare(platform)}
              className={`${platform.color} text-white ${sizeClasses[size]} p-0 rounded-full`}
              title={`مشاركة على ${platform.name}`}
            >
              <i className={platform.icon}></i>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Floating share button for pages
export function FloatingShareButton(props: SocialShareProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
    >
      <SocialShare {...props} />
    </motion.div>
  );
}