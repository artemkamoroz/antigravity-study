import { useState } from 'react';
import styles from './Counter.module.css';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Counter: <span className={styles.count}>{count}</span></h3>
            <p className={styles.text}>
                I use <strong>State</strong>. I remember clicks.
            </p>
            <button
                className={styles.button}
                onClick={() => setCount(count + 1)}
            >
                Increment (+1)
            </button>
        </div>
    );
}

export default Counter;
