import { useState } from 'react';
import WelcomeMessage from './WelcomeMessage';
import Counter from './Counter';
import TodoApp from './TodoApp';
import styles from './App.module.css';

function App() {
  const [userName, setUserName] = useState("User");
  const [showDemo, setShowDemo] = useState(true);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>React Mastery ⚛️</h1>

      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.grid}>
        <WelcomeMessage name={userName} />
      </div>

      <hr className={styles.divider} />

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowDemo(!showDemo)}
          className={styles.button}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #646cff',
            backgroundColor: showDemo ? '#1a1a1a' : '#646cff',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showDemo ? 'Hide Basics 🙈' : 'Show Basics 👁️'}
        </button>
      </div>

      {showDemo && (
        <div style={{ marginBottom: '40px' }}>
          <Counter />
        </div>
      )}

      <hr className={styles.divider} />

      {/* Our First "Real" Feature */}
      <TodoApp />
    </div>
  )
}

export default App;
