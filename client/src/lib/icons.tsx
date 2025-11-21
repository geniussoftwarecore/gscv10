import { 
  Smartphone, 
  Code, 
  Palette, 
  Megaphone, 
  Brain, 
  Settings,
  ShoppingCart,
  Building,
  Database,
  HeartPulse,
  GraduationCap,
  Monitor,
  Laptop,
  Users,
  Zap
} from "lucide-react";

// Icon mapping for services and portfolio items
export const iconMap = {
  smartphone: Smartphone,
  code: Code,
  palette: Palette,
  megaphone: Megaphone,
  brain: Brain,
  settings: Settings,
  "shopping-cart": ShoppingCart,
  building: Building,
  database: Database,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  monitor: Monitor,
  laptop: Laptop,
  users: Users,
  zap: Zap,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className = "", size = 24 }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    return <div className={`w-6 h-6 bg-gray-200 rounded ${className}`} />;
  }
  
  return <IconComponent className={className} size={size} />;
}