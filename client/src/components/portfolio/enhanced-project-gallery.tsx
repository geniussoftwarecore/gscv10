import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Eye, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageLightboxGallery } from "./image-lightbox-gallery";

interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  type: 'image' | 'video';
  caption?: string;
}

interface Project {
  id: string;
  title: string;
  imageUrl: string;
  gallery?: GalleryItem[];
  category: string;
  technologies?: string[];
  description: string;
}

interface EnhancedProjectGalleryProps {
  project: Project;
  className?: string;
}

export function EnhancedProjectGallery({ project, className = "" }: EnhancedProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Create gallery items from project data
  const galleryItems: GalleryItem[] = [
    {
      id: `${project.id}-main`,
      url: project.imageUrl,
      alt: project.title,
      type: 'image',
      caption: project.description
    },
    ...(project.gallery || [])
  ];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Project Image */}
      <motion.div
        className="relative group cursor-pointer overflow-hidden rounded-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onClick={() => openLightbox(0)}
      >
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">{project.title}</h3>
              <p className="text-white/80 text-sm">انقر للعرض بحجم كامل</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              <ZoomIn size={16} className="ml-1" />
              عرض
            </Button>
          </div>
        </div>

        {/* Gallery Count Badge */}
        {galleryItems.length > 1 && (
          <Badge className="absolute top-4 right-4 bg-black/50 text-white border-white/20">
            <Eye size={12} className="ml-1" />
            {galleryItems.length} صور
          </Badge>
        )}
      </motion.div>

      {/* Additional Gallery Images */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {project.gallery.slice(0, 5).map((item, index) => (
            <motion.div
              key={item.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => openLightbox(index + 1)}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play size={24} className="text-white" />
                  </div>
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ZoomIn size={20} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Show More Button */}
          {project.gallery.length > 5 && (
            <motion.button
              className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => openLightbox(1)}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  +{project.gallery.length - 5}
                </div>
                <div className="text-xs text-gray-500">المزيد</div>
              </div>
            </motion.button>
          )}
        </div>
      )}

      {/* Lightbox Gallery */}
      <ImageLightboxGallery
        items={galleryItems}
        initialIndex={selectedImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        projectTitle={project.title}
      />
    </div>
  );
}