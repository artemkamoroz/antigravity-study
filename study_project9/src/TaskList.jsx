import styles from './TaskList.module.css';

function TaskList({ tasks }) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Your Learning Path 📚</h3>
            <ul className={styles.list}>
                {tasks.map((task, index) => (
                    <li key={index} className={styles.item}>
                        <span className={styles.icon}>✅</span>
                        {task}
                    </li>
                ))}
            </ul>
            <p className={styles.note}>
                Every item has a unique <code>key</code> so React can track it.
            </p>
        </div>
    );
}

export default TaskList;
