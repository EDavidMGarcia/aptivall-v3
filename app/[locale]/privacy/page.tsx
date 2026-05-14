import { getTranslations } from 'next-intl/server';
import styles from './privacy.module.css';

// Metadatos dinámicos para SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('privacy.title'),
    description: t('privacy.description'),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.lastUpdated}>{t('lastUpdated')}</p>
      <p className={styles.intro}>{t('intro')}</p>

      {(['0', '1', '2', '3', '4', '5', '6'] as const).map((index) => (
        <div key={index} className={styles.section}>
          <h2 className={styles.heading}>{t(`sections.${index}.heading`)}</h2>
          <p className={styles.body}>{t(`sections.${index}.body`)}</p>
        </div>
      ))}
    </section>
  );
}