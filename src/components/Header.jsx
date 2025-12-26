import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-brand">
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Beast Shopping
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart" className="cart-icon">
          Cart 
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>
      </nav>
    </header>
  );
};

export default Header;