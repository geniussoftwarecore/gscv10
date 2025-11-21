import { useState } from "react";
import { motion } from "framer-motion";
import { ServiceHero } from "@/components/services/marketing/ServiceHero";
import { FeatureGrid } from "@/components/services/marketing/FeatureGrid";
import { ProcessTimeline } from "@/components/services/marketing/ProcessTimeline";
import { StickyCTA } from "@/components/services/marketing/StickyCTA";
import { MarketingWizard } from "@/components/services/marketing/wizard/MarketingWizard";

export default function DigitalMarketingService() {
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
      
      {/* Marketing Wizard Modal */}
      {showWizard && (
        <MarketingWizard onClose={handleCloseWizard} />
      )}
    </motion.div>
  );
}