import { useState, useEffect } from 'react';
import styles from './TodoApp.module.css';

function TodoApp() {
    // 1. Initial value: Try to load from localStorage, fallback to demo tasks
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('react_todo_tasks');
        return savedTasks ? JSON.parse(savedTasks) : [
            { id: 1, text: 'Learn React Fundamentals' },
            { id: 2, text: 'Build first interactive app' }
        ];
    });

    const [inputValue, setInputValue] = useState('');

    // 2. Effect: Automatically save to localStorage whenever 'tasks' changes
    useEffect(() => {
        localStorage.setItem('react_todo_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;

        const newTask = {
            id: Date.now(),
            text: inputValue
        };

        setTasks([...tasks, newTask]);
        setInputValue('');
    };

    const deleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Project: Interactive Todo 🚀</h2>

            <form onSubmit={addTask} className={styles.inputGroup}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What needs to be done?"
                    className={styles.input}
                />
                <button type="submit" className={styles.addButton}>Add</button>
            </form>

            <ul className={styles.taskList}>
                {tasks.map((task) => (
                    <li key={task.id} className={styles.taskItem}>
                        <span>{task.text}</span>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {tasks.length === 0 && <p className={styles.emptyMsg}>All caught up! ☕️</p>}
        </div>
    );
}

export default TodoApp;
