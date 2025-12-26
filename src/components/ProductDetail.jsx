import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data.product || null);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fallback to mock data
        setProduct({
          id: parseInt(id),
          title: 'Sample Product',
          price: 49.99,
          category: 'Sample Category',
          image: 'https://via.placeholder.com/400x300?text=Product+Image',
          description: 'This is a sample product description. In a real application, this would come from the backend API.',
          stock: 10
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${quantity} ${product.title}(s) added to cart!`);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && (!product?.stock || value <= product.stock)) {
      setQuantity(value);
    }
  };

  // Handle increment quantity
  const incrementQuantity = () => {
    if (product?.stock && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (!product?.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  // Handle decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
        &larr; Back to Products
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div>
          <img 
            src={product.image} 
            alt={product.title} 
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
          />
        </div>
        
        <div>
          <h1>{product.title}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-price" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60', marginBottom: '1rem' }}>
            ${product.price}
          </p>
          
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {product.description}
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Quantity</h3>
            <div className="quantity-control">
              <button 
                className="quantity-btn" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                className="quantity-input" 
                value={quantity} 
                onChange={handleQuantityChange}
                min="1"
                max={product.stock || 999}
              />
              <button 
                className="quantity-btn" 
                onClick={incrementQuantity}
                disabled={product.stock && quantity >= product.stock}
              >
                +
              </button>
            </div>
            {product.stock && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
                In stock: {product.stock} items
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleAddToCart}
              style={{ flex: 1 }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;