import { getTranslations } from 'next-intl/server';
import styles from './terms.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('terms.title'),
    description: t('terms.description'),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TermsPage' });

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.lastUpdated}>{t('lastUpdated')}</p>
      <p className={styles.intro}>{t('intro')}</p>

      {Array.from({ length: 8 }, (_, i) => i.toString()).map((index) => (
        <div key={index} className={styles.section}>
          <h2 className={styles.heading}>{t(`sections.${index}.heading`)}</h2>
          <p className={styles.body}>{t(`sections.${index}.body`)}</p>
        </div>
      ))}
    </section>
  );
}