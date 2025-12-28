import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Profile({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            fetch(`${API_URL}/api/orders/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user) {
        return (
            <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                <h2>Пожалуйста, войдите, чтобы увидеть профиль.</h2>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '10px', letterSpacing: '-2px' }}>
                    Привет, {user.email.split('@')[0]}
                </h1>
                <p style={{ color: '#6e6e73', fontSize: '1.2rem', marginBottom: '50px' }}>
                    Управляйте своим аккаунтом и просматривайте историю заказов.
                </p>

                <section style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>История заказов</h2>
                    {loading ? (
                        <p>Загрузка заказов...</p>
                    ) : orders.length === 0 ? (
                        <div style={{
                            padding: '40px',
                            background: '#f5f5f7',
                            borderRadius: '20px',
                            textAlign: 'center',
                            color: '#86868b'
                        }}>
                            У вас пока нет заказов.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {orders.map(order => (
                                <motion.div
                                    key={order.id}
                                    whileHover={{ scale: 1.01 }}
                                    style={{
                                        padding: '25px',
                                        background: '#fff',
                                        borderRadius: '20px',
                                        border: '1px solid #d2d2d7',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: '#86868b', marginBottom: '5px' }}>
                                            Заказ #{order.id.toString().slice(0, 8)}
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                            {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#000' }}>
                                            {order.amount.toLocaleString()} ₽
                                        </div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            color: order.status === 'paid' ? '#34c759' : '#ff9500',
                                            fontWeight: '600',
                                            textTransform: 'uppercase'
                                        }}>
                                            {order.status === 'paid' ? 'Оплачено' : 'В обработке'}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Настройки аккаунта</h2>
                    <div style={{
                        padding: '25px',
                        background: '#f5f5f7',
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontWeight: '600' }}>Email</div>
                            <div style={{ color: '#6e6e73' }}>{user.email}</div>
                        </div>
                        <button style={{
                            background: 'none',
                            border: 'none',
                            color: '#0066cc',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}>
                            Изменить
                        </button>
                    </div>
                </section>
            </motion.div>
        </div>
    );
}

export default Profile;
