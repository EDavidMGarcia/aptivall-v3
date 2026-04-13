import styles from './GlassCard.module.css';

interface Props {
  children: React.ReactNode;
}

export const GlassCard = ({ children }: Props) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.innerContent}>
        {children}
      </div>
    </div>
  );
};