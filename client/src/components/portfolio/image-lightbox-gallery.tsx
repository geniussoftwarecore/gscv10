import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  type: 'image' | 'video';
  caption?: string;
}

interface ImageLightboxGalleryProps {
  items: GalleryItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
}

export function ImageLightboxGallery({
  items,
  initialIndex = 0,
  isOpen,
  onClose,
  projectTitle
}: ImageLightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const currentItem = items[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          navigatePrev();
          break;
        case 'ArrowRight':
          navigateNext();
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(prev * 1.2, 3));
          break;
        case '-':
          setZoom(prev => Math.max(prev / 1.2, 0.5));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isOpen, currentIndex]);

  const navigateNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
    setZoom(1);
  };

  const navigatePrev = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    setZoom(1);
  };

  const handleShare = async () => {
    if (navigator.share && currentItem) {
      try {
        await navigator.share({
          title: projectTitle || 'صورة من المعرض',
          text: currentItem.caption || currentItem.alt,
          url: currentItem.url
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard?.writeText(currentItem.url);
      }
    }
  };

  const handleDownload = () => {
    if (currentItem) {
      const link = document.createElement('a');
      link.href = currentItem.url;
      link.download = `${projectTitle || 'gallery-item'}-${currentIndex + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Navigation & Controls */}
        <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
              {currentIndex + 1} من {items.length}
            </Badge>
            {projectTitle && (
              <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
                {projectTitle}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            {currentItem.type === 'image' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom(prev => Math.max(prev / 1.2, 0.5));
                  }}
                  className="text-white hover:bg-white/20"
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom(prev => Math.min(prev * 1.2, 3));
                  }}
                  className="text-white hover:bg-white/20"
                  disabled={zoom >= 3}
                >
                  <ZoomIn size={16} />
                </Button>
              </>
            )}

            {/* Share Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="text-white hover:bg-white/20"
            >
              <Share2 size={16} />
            </Button>

            {/* Download Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="text-white hover:bg-white/20"
            >
              <Download size={16} />
            </Button>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Previous Button */}
        {items.length > 1 && (
          <Button
            variant="ghost"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              navigatePrev();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
          >
            <ChevronRight size={24} />
          </Button>
        )}

        {/* Next Button */}
        {items.length > 1 && (
          <Button
            variant="ghost"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              navigateNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
          >
            <ChevronLeft size={24} />
          </Button>
        )}

        {/* Main Content */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="max-w-[90vw] max-h-[80vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {currentItem.type === 'image' ? (
            <motion.img
              src={currentItem.url}
              alt={currentItem.alt}
              className="max-w-full max-h-full object-contain cursor-zoom-in"
              style={{
                transform: `scale(${zoom})`,
                transition: 'transform 0.2s ease-out'
              }}
              onClick={() => setZoom(prev => prev === 1 ? 2 : 1)}
              draggable={false}
            />
          ) : (
            <div className="relative">
              <video
                src={currentItem.url}
                className="max-w-full max-h-full object-contain"
                controls={isVideoPlaying}
                autoPlay={false}
                loop
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              />
              {!isVideoPlaying && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play size={24} />
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {/* Caption */}
        {currentItem.caption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 text-center"
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 mx-auto max-w-2xl">
              <p className="text-white text-sm leading-relaxed">
                {currentItem.caption}
              </p>
            </div>
          </motion.div>
        )}

        {/* Thumbnail Strip */}
        {items.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                    setZoom(1);
                  }}
                  className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-white scale-110' 
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Play size={16} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}