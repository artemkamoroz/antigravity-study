import styles from './WelcomeMessage.module.css';

function WelcomeMessage({ name }) {
    return (
        <div className={styles.card}>
            <h3 className={styles.greeting}>Hello, <span className={styles.highlight}>{name}</span>! 👋</h3>
            <p className={styles.description}>
                I was created using <strong>Props</strong>.<br />
                My name is static.
            </p>
        </div>
    );
}

export default WelcomeMessage;
