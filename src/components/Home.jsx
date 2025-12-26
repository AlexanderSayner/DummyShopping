import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Fetch featured products on component mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // API call to get featured products (limit to 6 for home page)
        const response = await axios.get('/api/products?featured=true&limit=6');
        setFeaturedProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to mock data if API fails
        setFeaturedProducts([
          {
            id: 1,
            title: 'Wireless Headphones',
            price: 99.99,
            category: 'Electronics',
            image: 'https://via.placeholder.com/300x200?text=Headphones',
            description: 'High-quality wireless headphones with noise cancellation.'
          },
          {
            id: 2,
            title: 'Smart Watch',
            price: 199.99,
            category: 'Electronics',
            image: 'https://via.placeholder.com/300x200?text=Smart+Watch',
            description: 'Feature-rich smartwatch with health monitoring.'
          },
          {
            id: 3,
            title: 'Running Shoes',
            price: 89.99,
            category: 'Sports',
            image: 'https://via.placeholder.com/300x200?text=Shoes',
            description: 'Comfortable running shoes for all terrains.'
          }
        ]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Welcome to Beast Shopping</h1>
        <p>Discover amazing products at unbeatable prices</p>
        <Link to="/products" className="btn btn-primary">Shop Now</Link>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.title} className="product-image" />
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price}</p>
                <div className="product-actions">
                  <Link to={`/product/${product.id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;