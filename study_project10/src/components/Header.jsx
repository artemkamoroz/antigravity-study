import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from './Header.module.css';

function Header({ cartCount, user }) {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>iStore</Link>
                <nav className={styles.nav}>
                    <Link to="/" className={styles.link}>Главная</Link>
                    <Link to="/catalog" className={styles.link}>Каталог</Link>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Link to="/profile" className={styles.link} style={{ fontSize: '0.9rem', color: '#6e6e73' }}>
                                {user.email}
                            </Link>
                            <button onClick={handleLogout} className={styles.link} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <Link to="/auth" className={styles.link}>Войти</Link>
                    )}
                    <Link to="/cart" className={styles.cartBtn}>
                        🛒 Корзина <span className={styles.badge}>{cartCount}</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
