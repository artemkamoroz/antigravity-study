import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Регистрация успешна! Проверьте почту для подтверждения.');
            }
            navigate('/catalog');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '30px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}
            >
                <motion.h2
                    key={isLogin ? 'login-h2' : 'signup-h2'}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px', letterSpacing: '-1px' }}
                >
                    {isLogin ? 'Вход в iStore' : 'Создать аккаунт'}
                </motion.h2>
                <p style={{ color: '#6e6e73', marginBottom: '30px' }}>
                    {isLogin ? 'С возвращением!' : 'Станьте частью сообщества Apple.'}
                </p>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '15px 20px',
                            borderRadius: '12px',
                            border: '1px solid #d2d2d7',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '15px 20px',
                            borderRadius: '12px',
                            border: '1px solid #d2d2d7',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ color: '#ff3b30', fontSize: '0.9rem', margin: '10px 0' }}
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        style={{
                            background: '#0071e3',
                            color: 'white',
                            border: 'none',
                            padding: '15px',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        {loading ? 'Секунду...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </motion.button>
                </form>

                <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #f5f5f7' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default Auth;
