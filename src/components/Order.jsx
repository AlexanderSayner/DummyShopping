import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import axios from 'axios';

const Order = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [orderForm, setOrderForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit-card'
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customer: {
          firstName: orderForm.firstName,
          lastName: orderForm.lastName,
          email: orderForm.email,
          phone: orderForm.phone,
          address: orderForm.address,
          city: orderForm.city,
          state: orderForm.state,
          zipCode: orderForm.zipCode,
          country: orderForm.country
        },
        items: cartItems.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: getTotalPrice() + 5.99 + (getTotalPrice() * 0.08), // subtotal + shipping + tax
        shippingCost: 5.99,
        taxAmount: getTotalPrice() * 0.08,
        paymentMethod: orderForm.paymentMethod
      };

      // API call to place order
      const response = await axios.post('/api/orders', orderData);
      
      // Clear cart after successful order
      clearCart();
      setOrderPlaced(true);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. You will receive a confirmation email shortly.</p>
        <p>Redirecting to home page...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <h1>Order</h1>
        <p>Your cart is empty. Please add items to your cart before placing an order.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <form onSubmit={handleSubmit} className="order-form">
            <h2>Shipping Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  value={orderForm.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  value={orderForm.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={orderForm.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={orderForm.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-input"
                value={orderForm.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  value={orderForm.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state" className="form-label">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  value={orderForm.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  className="form-input"
                  value={orderForm.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="form-input"
                  value={orderForm.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="form-input"
                value={orderForm.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="credit-card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank-transfer">Bank Transfer</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-success" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.title} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div className="order-item">
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="order-item">
                <span>Shipping:</span>
                <span>$5.99</span>
              </div>
              <div className="order-item">
                <span>Tax:</span>
                <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
              <div className="order-total">
                Total: ${(getTotalPrice() + 5.99 + (getTotalPrice() * 0.08)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;