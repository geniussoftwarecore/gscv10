import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  type: 'image' | 'video';
}

interface LightboxGalleryProps {
  items: GalleryItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function LightboxGallery({
  items,
  initialIndex = 0,
  isOpen,
  onClose
}: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const currentItem = items[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    resetZoom();
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    resetZoom();
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.5, 4));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev / 1.5, 0.5));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case '+':
        zoomIn();
        break;
      case '-':
        zoomOut();
        break;
    }
  };

  const handleDownload = () => {
    if (currentItem.type === 'image') {
      const link = document.createElement('a');
      link.href = currentItem.url;
      link.download = currentItem.alt || `image-${currentIndex + 1}`;
      link.click();
    }
  };

  useState(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => handleKeyDown(e);
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDownEvent);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDownEvent);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
      document.body.style.overflow = 'unset';
    };
  });

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Header Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 z-60 p-4 bg-gradient-to-b from-black/50 to-transparent"
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {currentIndex + 1} من {items.length}
              </span>
              <span className="text-sm text-gray-300">
                {currentItem.alt}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {currentItem.type === 'image' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomOut();
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomIn();
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div 
          className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-20"
          onClick={(e) => e.stopPropagation()}
        >
          {currentItem.type === 'image' ? (
            <motion.img
              key={currentIndex}
              src={currentItem.url}
              alt={currentItem.alt}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: scale,
                x: position.x,
                y: position.y
              }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
              style={{
                transformOrigin: 'center center'
              }}
              drag
              dragConstraints={{
                left: -100,
                right: 100,
                top: -100,
                bottom: 100
              }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              onDoubleClick={() => {
                if (scale === 1) {
                  zoomIn();
                } else {
                  resetZoom();
                }
              }}
            />
          ) : (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-full"
            >
              <video
                src={currentItem.url}
                controls
                autoPlay={isVideoPlaying}
                className="max-w-full max-h-full"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
            </motion.div>
          )}
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-16 w-16 rounded-full"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-16 w-16 rounded-full"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          </>
        )}

        {/* Thumbnails */}
        {items.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm"
          >
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  resetZoom();
                }}
                className={`relative w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-white' 
                    : 'border-transparent hover:border-white/50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeThumbnail"
                    className="absolute inset-0 bg-white/20"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 right-4 text-white/70 text-xs space-y-1"
        >
          <div>اضغط ESC للإغلاق</div>
          <div>استخدم الأسهم للتنقل</div>
          {currentItem.type === 'image' && (
            <div>اضغط مرتين للتكبير</div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}