import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

function Catalog({ onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Все');

    const categories = ['Все', 'iPhone', 'Mac', 'iPad', 'Watch', 'AirPods'];

    useEffect(() => {
        // Artificial delay for UX
        const timer = setTimeout(() => {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            fetch(`${API_URL}/api/products`)
                .then(res => {
                    if (!res.ok) throw new Error('Ошибка при загрузке данных с сервера');
                    return res.json();
                })
                .then(data => {
                    setProducts(data);
                    setFilteredProducts(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError(err.message);
                    setLoading(false);
                });
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let result = products;

        if (activeCategory !== 'Все') {
            result = result.filter(p => p.name.includes(activeCategory));
        }

        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredProducts(result);
    }, [searchTerm, activeCategory, products]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}
        >
            <header style={{ marginBottom: '40px' }}>
                <motion.h1
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-1px' }}
                >
                    Каталог
                </motion.h1>
                <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ color: '#6e6e73', fontSize: '1.2rem', marginBottom: '30px' }}
                >
                    Найдите своё идеальное устройство. (Данные из API 🌐)
                </motion.p>

                {/* Search and Filter */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        background: '#f5f5f7',
                        padding: '20px',
                        borderRadius: '20px'
                    }}
                >
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            fontSize: '1rem',
                            border: '1px solid #d2d2d7',
                            borderRadius: '12px',
                            outline: 'none'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeCategory === cat ? '#0071e3' : '#fff',
                                    color: activeCategory === cat ? '#fff' : '#000',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </header>

            {error && <p style={{ color: '#ff3b30', marginBottom: '20px' }}>⚠️ {error}</p>}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '30px'
                }}
            >
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="skeletons"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'contents' }}
                        >
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'contents' }}
                        >
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={onAddToCart}
                                    />
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#86868b' }}>
                                    Ничего не найдено.
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

export default Catalog;
