import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GalleryItem } from "@/data/portfolio";

interface LightboxViewerProps {
  items: GalleryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
}

export default function LightboxViewer({
  items,
  initialIndex,
  isOpen,
  onClose,
  projectTitle
}: LightboxViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Reset states when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const currentItem = items[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
    if (zoom <= 1) {
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - imagePosition.x, 
      y: e.clientY - imagePosition.y 
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectTitle || 'مشروع من جينيوس سوفت وير كور',
          text: currentItem.captionAr || currentItem.altAr,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Header Controls */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="absolute top-0 left-0 right-0 p-4 z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-brand-sky-accent text-white">
                {currentIndex + 1} من {items.length}
              </Badge>
              {currentItem.captionAr && (
                <span className="text-white text-sm max-w-md truncate">
                  {currentItem.captionAr}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-white hover:bg-white/20"
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-white text-sm min-w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-white hover:bg-white/20"
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              {/* Share Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4" />
              </Button>

              {/* Download Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = currentItem.url;
                  link.download = `${projectTitle || 'project'}-${currentIndex + 1}`;
                  link.click();
                }}
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>

              {/* Close Button */}
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

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            <motion.button
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          </>
        )}

        {/* Main Image Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="flex items-center justify-center h-full p-16"
          onClick={(e) => e.stopPropagation()}
        >
          {currentItem.type === 'image' ? (
            <motion.img
              key={currentIndex}
              src={currentItem.url}
              alt={currentItem.altAr}
              className={`max-w-full max-h-full object-contain select-none ${
                zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'
              }`}
              style={{
                transform: `scale(${zoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                transformOrigin: 'center center'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => {
                if (zoom === 1) handleZoomIn();
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              drag={zoom > 1}
              dragConstraints={{ 
                left: -200, right: 200, 
                top: -200, bottom: 200 
              }}
            />
          ) : (
            <video
              key={currentIndex}
              src={currentItem.url}
              controls
              className="max-w-full max-h-full"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center'
              }}
            />
          )}
        </motion.div>

        {/* Thumbnail Navigation */}
        {items.length > 1 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <Card className="p-2 bg-black/50 backdrop-blur-sm border-white/20">
              <div className="flex gap-2 max-w-md overflow-x-auto scrollbar-hide">
                {items.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                      setZoom(1);
                      setImagePosition({ x: 0, y: 0 });
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                      index === currentIndex 
                        ? 'border-brand-sky-accent scale-110' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                    whileHover={{ scale: index === currentIndex ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={item.url}
                      alt={item.altAr}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Loading Indicator */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}