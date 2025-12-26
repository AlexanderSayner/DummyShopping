import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/order');
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty</p>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          <div>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>${item.price}</p>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="quantity-input" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        min="1"
                      />
                      <button 
                        className="quantity-btn" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => removeFromCart(item.id)}
                      style={{ marginLeft: '1rem' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div style={{ marginBottom: '1rem' }}>
              <p>Subtotal: <strong>${getTotalPrice().toFixed(2)}</strong></p>
              <p>Shipping: <strong>$5.99</strong></p>
              <p>Tax: <strong>${(getTotalPrice() * 0.08).toFixed(2)}</strong></p>
              <div className="order-total">
                Total: ${(getTotalPrice() + 5.99 + (getTotalPrice() * 0.08)).toFixed(2)}
              </div>
            </div>
            <button 
              className="btn btn-success" 
              onClick={handleCheckout}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn btn-secondary" style={{ width: '100%' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;