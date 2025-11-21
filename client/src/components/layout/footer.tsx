import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/i18n/lang";
import { Button } from "@/components/ui/button";
import { COMPANY_INFO } from "@/lib/constants";

export default function Footer() {
  const { t } = useTranslation();
  const { lang, dir, setLang } = useLanguage();

  return (
    <footer 
      role="contentinfo" 
      className="bg-gray-50 border-t border-gray-200"
      dir={dir}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column A: Brand / About */}
          <div className={`${lang === 'ar' ? 'lg:order-1' : 'lg:order-1'}`}>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/brand/logo-gsc-icon.svg" 
                alt="GSC Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to PNG if SVG not available
                  e.currentTarget.src = "/brand/logo-gsc-32.png";
                }}
              />
              <div className="font-bold text-lg text-gray-900">
                {t('brand.shortName')}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t('footer.aboutText')}
            </p>
            <Button
              asChild
              size="sm"
              className="rounded-xl"
            >
              <Link href="/contact">
                {t('footer.cta')}
              </Link>
            </Button>
          </div>

          {/* Column B: Services */}
          <div className={`${lang === 'ar' ? 'lg:order-2' : 'lg:order-2'}`}>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t('footer.servicesTitle')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.services.webApps')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.services.mobileApps')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.services.crmErp')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.services.integrations')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.services.brandingUi')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.services.devops')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column C: Resources & Policies */}
          <div className={`${lang === 'ar' ? 'lg:order-3' : 'lg:order-3'}`}>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t('footer.resourcesTitle')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.resources.docs')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.resources.blog')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.resources.terms')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.resources.privacy')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <span className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors cursor-pointer">
                    {t('footer.resources.cookies')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column D: Contact & Social */}
          <div className={`${lang === 'ar' ? 'lg:order-4' : 'lg:order-4'}`}>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t('footer.contactTitle')}
            </h3>
            
            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a 
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a 
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a 
                  href={`tel:${COMPANY_INFO.phoneSecondaryRaw}`}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {COMPANY_INFO.phoneSecondary}
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                {t('footer.socialTitle')}
              </h4>
              <div className="flex gap-3">
                <a
                  href={COMPANY_INFO.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={COMPANY_INFO.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={COMPANY_INFO.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={COMPANY_INFO.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-12 pt-6">
          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-600 text-center sm:text-left">
              &copy; {new Date().getFullYear()} {t('brand.shortName')} &mdash; {t('footer.copyright')}
            </div>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('footer.language')}:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setLang('ar')}
                  className={`px-2 py-1 text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    lang === 'ar' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="تبديل إلى العربية"
                >
                  العربية
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    lang === 'en' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="Switch to English"
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}