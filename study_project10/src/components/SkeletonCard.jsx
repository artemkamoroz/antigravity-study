import styles from './SkeletonCard.module.css';

function SkeletonCard() {
    return (
        <div className={styles.card}>
            <div className={`${styles.skeleton} ${styles.image}`} />
            <div className={`${styles.skeleton} ${styles.title}`} />
            <div className={`${styles.skeleton} ${styles.desc}`} />
            <div className={`${styles.skeleton} ${styles.desc}`} style={{ width: '60%' }} />
            <div className={styles.footer}>
                <div className={`${styles.skeleton} ${styles.price}`} />
                <div className={`${styles.skeleton} ${styles.button}`} />
            </div>
        </div>
    );
}

export default SkeletonCard;
