import { PageHeader } from "@/components/ui/PageHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/i18n/lang";

export function PageHeaderContact() {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  return (
    <PageHeader 
      title={t('contact.title')}
      subtitle={t('contact.subtitle')}
      background="light"
    />
  );
}