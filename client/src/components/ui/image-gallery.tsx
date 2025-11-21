import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  className?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  interval?: number;
}

export function ImageGallery({
  images,
  className,
  showThumbnails = true,
  autoPlay = false,
  interval = 5000,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Main Image Display */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            onClick={() => setIsModalOpen(true)}
          />
        </AnimatePresence>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              onClick={prevImage}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
            <Button
              onClick={nextImage}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Expand Icon */}
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <i className="fas fa-expand"></i>
        </Button>
      </div>

      {/* Image Title and Description */}
      {(images[currentIndex].title || images[currentIndex].description) && (
        <div className="mt-4">
          {images[currentIndex].title && (
            <h3 className="text-lg font-semibold text-secondary mb-2">
              {images[currentIndex].title}
            </h3>
          )}
          {images[currentIndex].description && (
            <p className="text-gray-600 text-sm">
              {images[currentIndex].description}
            </p>
          )}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-primary scale-110"
                  : "border-gray-300 hover:border-primary/50"
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Close Button */}
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                size="sm"
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <i className="fas fa-times"></i>
              </Button>

              {/* Modal Navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Button>
                  <Button
                    onClick={nextImage}
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}