import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('istore_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('istore_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Detect success/cancel from Stripe
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setOrderComplete(true);
      setCart([]);
      // Clean up URL
      window.history.replaceState({}, document.title, "/cart");
      setTimeout(() => setOrderComplete(false), 8000);
    }
  }, []);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          userId: user?.id || 'guest',
        }),
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Не удалось создать сессию оплаты');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при переходе к оплате. Проверьте STRIPE_SECRET_KEY в .env');
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Router>
      <Header cartCount={cartCount} user={user} />
      <main style={{ minHeight: '100vh', background: '#fff' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog onAddToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route
            path="/cart"
            element={
              <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '40px' }}>Ваша корзина</h1>

                {orderComplete && (
                  <div style={{
                    background: '#e6fffa',
                    border: '1px solid #38b2ac',
                    color: '#2c7a7b',
                    padding: '25px',
                    borderRadius: '15px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>✨ Оплата прошла успешно!</h2>
                    <p>Спасибо за ваш заказ. Мы уже готовим его к отправке.</p>
                  </div>
                )}

                {cart.length === 0 && !orderComplete ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ color: '#6e6e73', fontSize: '1.2rem', marginBottom: '20px' }}>В вашей корзине пока пусто.</p>
                    <Link to="/catalog">
                      <button style={{
                        background: '#0071e3', color: 'white', border: 'none',
                        padding: '12px 24px', borderRadius: '20px', cursor: 'pointer'
                      }}>
                        Перейти к покупкам
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {cart.map(item => (
                        <li key={item.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '20px 0',
                          borderBottom: '1px solid #eee'
                        }}>
                          <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', marginRight: '20px' }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.name}</h4>
                            <p style={{ color: '#6e6e73', margin: 0 }}>{item.price.toLocaleString()} ₽ x {item.quantity}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: '1.5rem', padding: '10px', color: '#ff3b30'
                            }}
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div style={{
                      marginTop: '40px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                        Итого: {totalPrice.toLocaleString()} ₽
                      </div>
                      <button
                        onClick={handleCheckout}
                        disabled={loading}
                        style={{
                          background: loading ? '#6e6e73' : '#000',
                          color: '#fff',
                          padding: '16px 32px',
                          border: 'none',
                          borderRadius: '30px',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        {loading ? 'Переходим к оплате...' : 'Оформить заказ'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            }
          />
        </Routes>
      </main>
      <footer style={{ padding: '60px 20px', textAlign: 'center', borderTop: '1px solid #eee', color: '#888', fontSize: '0.9rem' }}>
        © 2025 iStore Inc. Спроектировано в Купертино. Собрано в React.
      </footer>
    </Router>
  );
}

export default App;
