import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [sortOption, setSortOption] = useState('');

  // Fetch products with filters and pagination
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit: 12, // 12 products per page
        ...filters,
        sort: sortOption
      }).toString();
      
      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data.products || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalItems: response.data.totalItems || 0
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data
      setProducts([
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
        },
        {
          id: 4,
          title: 'Coffee Maker',
          price: 79.99,
          category: 'Home & Kitchen',
          image: 'https://via.placeholder.com/300x200?text=Coffee+Maker',
          description: 'Automatic coffee maker with timer function.'
        },
        {
          id: 5,
          title: 'Backpack',
          price: 49.99,
          category: 'Fashion',
          image: 'https://via.placeholder.com/300x200?text=Backpack',
          description: 'Durable backpack with multiple compartments.'
        },
        {
          id: 6,
          title: 'Desk Lamp',
          price: 29.99,
          category: 'Home & Kitchen',
          image: 'https://via.placeholder.com/300x200?text=Lamp',
          description: 'Adjustable LED desk lamp with touch controls.'
        }
      ]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 6
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to mock categories
      setCategories([
        { id: 'electronics', name: 'Electronics' },
        { id: 'sports', name: 'Sports' },
        { id: 'fashion', name: 'Fashion' },
        { id: 'home-kitchen', name: 'Home & Kitchen' }
      ]);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Apply filters and sort
  const applyFilters = () => {
    fetchProducts(1); // Reset to first page when applying filters
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
    setSortOption('');
  };

  // Handle pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProducts(page);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters, sortOption]);

  return (
    <div>
      <h1>Products</h1>
      
      {/* Filters Section */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search Products</label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search products..."
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min"
            />
          </div>
          <div>
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </div>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort">Sort By</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={applyFilters} className="btn btn-primary">Apply Filters</button>
          <button onClick={resetFilters} className="btn btn-secondary">Reset Filters</button>
        </div>
      </div>
      
      {/* Products Grid */}
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <>
          <p>{pagination.totalItems} products found</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => (
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
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => goToPage(pagination.currentPage - 1)} 
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={pagination.currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => goToPage(pagination.currentPage + 1)} 
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;