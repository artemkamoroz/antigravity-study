import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1.5px' }}>
                Лучшее. От самого сердца.
            </h1>
            <p style={{ fontSize: '1.5rem', color: '#6e6e73', maxWidth: '600px', margin: '0 auto 40px' }}>
                Откройте для себя мощь инноваций и чистоту дизайна в каждом устройстве.
            </p>
            <Link to="/catalog">
                <button style={{
                    background: '#0071e3',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '30px',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}>
                    Смотреть каталог
                </button>
            </Link>
        </div>
    );
}

export default Home;
