import { useState } from "react";
import { motion } from "framer-motion";
import { ServiceHero } from "@/components/services/design/ServiceHero";
import { FeatureGrid } from "@/components/services/design/FeatureGrid";
import { ProcessTimeline } from "@/components/services/design/ProcessTimeline";
import { StickyCTA } from "@/components/services/design/StickyCTA";
import { DesignWizard } from "@/components/services/design/wizard/DesignWizard";

export default function GraphicsDesignService() {
  const [showWizard, setShowWizard] = useState(false);

  const handleStartWizard = () => {
    setShowWizard(true);
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white dark:bg-gray-900"
    >
      {/* Service Hero Section */}
      <ServiceHero onStartWizard={handleStartWizard} />
      
      {/* Features Grid Section */}
      <FeatureGrid />
      
      {/* Process Timeline Section */}
      <ProcessTimeline />
      
      {/* Sticky CTA */}
      <StickyCTA onStartWizard={handleStartWizard} />
      
      {/* Design Wizard Modal */}
      {showWizard && (
        <DesignWizard onClose={handleCloseWizard} />
      )}
    </motion.div>
  );
}