import React, { useState } from 'react';
import './App.css';

const ProductCard = ({ product, quantity, onAddToCart, onRemoveFromCart, onQuantityChange, onWeightChange, selectedWeight }) => {
  const weightOptions = [
    { value: 250, label: '250 г' },
    { value: 500, label: '500 г' },
    { value: 1000, label: '1 кг' },
    { value: 1500, label: '1.5 кг' },
    { value: 2000, label: '2 кг' }
  ];

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <span className="product-category">{product.category}</span>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price} Руб./кг</p>

        <div className="weight-selection">
          <label htmlFor={`weight-${product.id}`}>Вес:</label>
          <select
            id={'weight-${product.id}'}
            value={selectedWeight || product.weight}
            onChange={(e) => onWeightChange(product.id, parseInt(e.target.value))}
            className="weight-select"
          >
            {weightOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="product-actions">
          <button 
            className="action-btn remove-btn"
            onClick={onRemoveFromCart}
            disabled={quantity === 0}
          >
            -
          </button>
          
          <span className="quantity">{quantity}</span>
          
          <button 
            className="action-btn add-btn"
            onClick={onAddToCart}
          >
            +
          </button>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={onAddToCart}
        >
          {quantity > 0 ? 'Добавить ещё' : 'Добавить'}
        </button>
      </div>
    </div>
  );
};

const Header = ({ totalItems, totalPrice, currentCategory, onCategoryChange, onShowCart }) => {
  const categories = ['Все товары', 'Овощи', 'Фрукты'];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <h1 className="logo">Магнит</h1>
          
          <nav className="categories">
            {categories.map(category => (
              <button
                key={category}
                className={"category-btn ${currentCategory === category ? 'active' : ''}"}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </nav>

          <div className="cart-info" onClick={onShowCart}>
            <span className="cart-icon"></span>
            <div className="cart-details">
              <span className="cart-count">{totalItems} шт.</span>
              <span className="cart-price">{totalPrice.toFixed(2)} Руб.</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Cart = ({ cart, products, onUpdateQuantity, onRemoveItem, onClose, onCheckout }) => {
  const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [productId, quantity]) => {
    const product = products.find(p => p.id === parseInt(productId));
    return sum + (product ? product.price * quantity * (product.weight / 1000) : 0);
  }, 0);

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2>Корзина покупок</h2>
          <button className="close-btn" onClick={onClose}>*</button>
        </div>
        
        <div className="cart-items">
          {Object.entries(cart).map(([productId, quantity]) => {
            const product = products.find(p => p.id === parseInt(productId));
            if (!product || quantity === 0) return null;  
            
            const itemPrice = product.price * quantity * (product.weight / 1000);
            
            return (
              <div key={productId} className="cart-item">
                <img src={product.image} alt={product.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h4>{product.name}</h4>
                  <p>{product.price} Руб./кг * {quantity} шт.</p>
                </div>
                <div className="cart-item-controls">
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => onUpdateQuantity(product.id, parseInt(e.target.value) || 0)}
                    className="cart-quantity-input"
                  />
                  <span className="cart-item-price">{itemPrice.toFixed(2)} ₽</span>
                  <button 
                    className="remove-item-btn"
                    onClick={() => onRemoveItem(product.id)}
                  >
                    *
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalItems === 0 ? (
          <p className="empty-cart">Пустенько</p>
        ) : (
          <>
            <div className="cart-total">
              <h3>Итого: {totalPrice.toFixed(2)} Руб.</h3>
              <p>Товаров: {totalItems} шт.</p>
            </div>
            
            <div className="cart-actions">
              <button className="checkout-btn" onClick={onCheckout}>
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [cart, setCart] = useState({});
  const [currentCategory, setCurrentCategory] = useState('Все товары');
  const [showCart, setShowCart] = useState(false);

  const products = [
    { id: 1, name: 'Огурцы', price: 59, weight: 1000, category: 'Овощи', image: 'image/1.jpg' },
    { id: 2, name: 'Помидоры', price: 119, weight: 1000, category: 'Овощи', image: 'image/2.jpg' },
    { id: 3, name: 'Болгарский перец', price: 149, weight: 1000, category: 'Овощи', image: 'image/3.jpg' },
    { id: 4, name: 'Репчатый лук', price: 39, weight: 1000, category: 'Овощи', image: 'image/4.jpg' },
    { id: 5, name: 'Чеснок', price: 150, weight: 1000, category: 'Овощи', image: 'image/5.jpg' },
    { id: 6, name: 'Морковь', price: 49, weight: 1000, category: 'Овощи', image: 'image/6.jpg' },
    { id: 7, name: 'Картофель', price: 35, weight: 1000, category: 'Овощи', image: 'image/7.jpg' },
    { id: 8, name: 'Капуста', price: 29, weight: 1000, category: 'Овощи', image: 'image/8.jpg' },
    { id: 9, name: 'Свекла', price: 45, weight: 1000, category: 'Овощи', image: 'image/9.jpg' },
    { id: 10, name: 'Батат', price: 125, weight: 1000, category: 'Овощи', image: 'image/10.jpg' },
    { id: 11, name: 'Редька', price: 70, weight: 1000, category: 'Овощи', image: 'image/11.jpg' },
    { id: 12, name: 'Редис', price: 100, weight: 1000, category: 'Овощи', image: 'image/12.jpg' },
    { id: 13, name: 'Кабачок', price: 82, weight: 1000, category: 'Овощи', image: 'image/13.jpg' },
    { id: 14, name: 'Тыква', price: 69, weight: 1000, category: 'Овощи', image: 'image/14.jpg' },
    { id: 15, name: 'Баклажан', price: 174, weight: 1000, category: 'Овощи', image: 'image/15.jpg' },

    { id: 16, name: 'Яблоки', price: 80, weight: 1000, category: 'Фрукты', image: 'image/16.jpg' },
    { id: 17, name: 'Груши', price: 115, weight: 1000, category: 'Фрукты', image: 'image/17.jpg' },
    { id: 18, name: 'Манго', price: 390, weight: 500, category: 'Фрукты', image: 'image/18.jpg' },
    { id: 19, name: 'Персики', price: 210, weight: 500, category: 'Фрукты', image: 'image/19.jpg' },
    { id: 20, name: 'Ананас', price: 340, weight: 1000, category: 'Фрукты', image: 'image/20.jpg' },
    { id: 21, name: 'Апельсины', price: 126, weight: 1000, category: 'Фрукты', image: 'image/21.jpg' },
    { id: 22, name: 'Лимоны', price: 119, weight: 500, category: 'Фрукты', image: 'image/22.jpg' },
    { id: 23, name: 'Киви', price: 202, weight: 500, category: 'Фрукты', image: 'image/23.jpg' },
    { id: 24, name: 'Мандарины', price: 145, weight: 1000, category: 'Фрукты', image: 'image/24.jpg' },
    { id: 25, name: 'Бананы', price: 74, weight: 1000, category: 'Фрукты', image: 'image/25.jpg' },
    { id: 26, name: 'Слива', price: 189, weight: 500, category: 'Фрукты', image: 'image/26.jpg' },
    { id: 27, name: 'Гранат', price: 350, weight: 500, category: 'Фрукты', image: 'image/27.jpg' },
    { id: 28, name: 'Абрикосы', price: 190, weight: 500, category: 'Фрукты', image: 'image/28.jpg' },
    { id: 29, name: 'Грейпфрут', price: 160, weight: 500, category: 'Фрукты', image: 'image/29.jpg' }
  ];

  const filteredProducts = currentCategory === 'Все товары' 
    ? products 
    : products.filter(product => product.category === currentCategory);

  const handleAddToCart = (productId) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => {
      const currentQuantity = prevCart[productId] || 0;
      if (currentQuantity <= 1) {
        const newCart = { ...prevCart };
        delete newCart[productId];
        return newCart;
      }
      return {
        ...prevCart,
        [productId]: currentQuantity - 1
      };
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 0) return;
    
    setCart(prevCart => {
      if (newQuantity === 0) {
        const newCart = { ...prevCart };
        delete newCart[productId];
        return newCart;
      }
      return {
        ...prevCart,
        [productId]: newQuantity
      };
    });
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    handleQuantityChange(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    handleQuantityChange(productId, 0);
  };

  const handleCheckout = () => {
    alert('Заказ оформлен! Спасибо за покупку в Магните!');
    setCart({});
    setShowCart(false);
  };

  const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [productId, quantity]) => {
    const product = products.find(p => p.id === parseInt(productId));
    return sum + (product ? product.price * quantity * (product.weight / 1000) : 0);
  }, 0);

  return (
    <div className="app">
      <Header 
        totalItems={totalItems} 
        totalPrice={totalPrice} 
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
        onShowCart={() => setShowCart(true)}
      />
      
      <div className="main-content">
        <div className="hero-section">
          <h1>Добро пожаловать в Магнит!</h1>
          <p>Свежие продукты по доступным ценам</p>
        </div>

        <div className="category-title">
          <h2>{currentCategory}</h2>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] || 0}
              onAddToCart={() => handleAddToCart(product.id)}
              onRemoveFromCart={() => handleRemoveFromCart(product.id)}
              onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
            />
          ))}
        </div>

        {showCart && (
          <Cart
            cart={cart}
            products={products}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveItem}
            onClose={() => setShowCart(false)}
            onCheckout={handleCheckout}
          />
        )}

        {totalItems > 0 && !showCart && (
          <div className="cart-summary">
            <h3>В корзине: {totalItems} товаров на сумму {totalPrice.toFixed(2)} Руб.</h3>
            <button 
              className="view-cart-btn"
              onClick={() => setShowCart(true)}
            >
              Перейти в корзину
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;