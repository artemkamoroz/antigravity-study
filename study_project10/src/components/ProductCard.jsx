import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

function ProductCard({ product, onAddToCart }) {
    return (
        <motion.div
            className={styles.card}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.imageWrapper}>
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className={styles.image}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                    />
                </div>
                <div className={styles.info}>
                    <h3 className={styles.name}>{product.name}</h3>
                    <p className={styles.desc}>{product.description}</p>
                </div>
            </Link>
            <div className={styles.info} style={{ paddingTop: 0 }}>
                <div className={styles.footer}>
                    <span className={styles.price}>{product.price.toLocaleString()} ₽</span>
                    <motion.button
                        className={styles.addBtn}
                        onClick={() => onAddToCart(product)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Купить
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

export default ProductCard;
