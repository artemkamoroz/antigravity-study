import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ProductDetail({ onAddToCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(data => {
                const found = data.find(p => p.id === parseInt(id));
                setProduct(found);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <p style={{ color: '#6e6e73' }}>Загрузка деталей устройства...</p>
        </div>
    );

    if (!product) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <h2>Устройство не найдено</h2>
            <Link to="/catalog">Вернуться в каталог</Link>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
                    />
                </motion.div>

                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <p style={{ color: '#bf4800', fontWeight: '600', marginBottom: '10px' }}>Новинка</p>
                    <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '20px', lineHeight: '1.1' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.4rem', color: '#6e6e73', marginBottom: '30px' }}>{product.description}</p>

                    <div style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '40px' }}>
                        {product.price.toLocaleString()} ₽
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAddToCart(product)}
                        style={{
                            background: '#0071e3',
                            color: 'white',
                            border: 'none',
                            padding: '18px 40px',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        Добавить в корзину
                    </motion.button>

                    <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                        <h4 style={{ marginBottom: '15px' }}>Характеристики:</h4>
                        <ul style={{ color: '#6e6e73', lineHeight: '1.8' }}>
                            <li>Процессор последнего поколения</li>
                            <li>Дисплей Retina с технологией Promotion</li>
                            <li>До 18 часов автономной работы</li>
                            <li>Поддержка 5G</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default ProductDetail;
