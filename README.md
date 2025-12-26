# Beast Shopping App

A modern e-commerce frontend built with React and Vite, designed to work with a backend API. This application implements a complete online shopping experience with filtering, pagination, cart management, and order processing.

## Features

- Product browsing with filtering and pagination
- Shopping cart functionality
- Order placement and checkout process
- Responsive design with Beast Design System
- Category-based navigation
- Price filtering and sorting options

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Frontend Architecture

The application follows a component-based architecture with the following structure:

```
src/
├── components/          # React components
│   ├── Header.jsx       # Navigation header
│   ├── Footer.jsx       # Page footer
│   ├── Home.jsx         # Home page with featured products
│   ├── ProductList.jsx  # Product listing with filters
│   ├── ProductDetail.jsx # Product details page
│   ├── Cart.jsx         # Shopping cart
│   └── Order.jsx        # Order checkout
├── contexts/            # React Context providers
│   └── CartContext.jsx  # Shopping cart state management
├── App.jsx              # Main application component
└── main.jsx             # Entry point
```

## API Integration Guide for Java Developers

This frontend application is designed to work with a RESTful backend API. Below is the complete API specification that needs to be implemented on the backend.

### Essential API Endpoints

These endpoints are required for the application to function properly:

#### 1. Product Management

**GET /api/products**
- Description: Retrieve a list of products with optional filtering and pagination
- Query Parameters:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 12)
  - `category` (optional): Filter by category ID
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
  - `search` (optional): Search term for product title
  - `sort` (optional): Sort option (price-asc, price-desc, name-asc, name-desc)
  - `featured` (optional): Boolean to get featured products only
- Response:
```json
{
  "products": [
    {
      "id": 1,
      "title": "Product Title",
      "price": 99.99,
      "category": "Electronics",
      "image": "https://example.com/image.jpg",
      "description": "Product description",
      "stock": 10
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 50
}
```

**GET /api/products/{id}**
- Description: Retrieve a specific product by ID
- Path Parameter: `id` - Product ID
- Response:
```json
{
  "product": {
    "id": 1,
    "title": "Product Title",
    "price": 99.99,
    "category": "Electronics",
    "image": "https://example.com/image.jpg",
    "description": "Product description",
    "stock": 10
  }
}
```

#### 2. Category Management

**GET /api/categories**
- Description: Retrieve all available product categories
- Response:
```json
{
  "categories": [
    {
      "id": "electronics",
      "name": "Electronics"
    },
    {
      "id": "sports",
      "name": "Sports"
    }
  ]
}
```

#### 3. Order Processing

**POST /api/orders**
- Description: Create a new order
- Request Body:
```json
{
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "items": [
    {
      "productId": 1,
      "title": "Product Title",
      "price": 99.99,
      "quantity": 2
    }
  ],
  "totalAmount": 205.97,
  "shippingCost": 5.99,
  "taxAmount": 4.99,
  "paymentMethod": "credit-card"
}
```
- Response:
```json
{
  "orderId": "ORD-2023-001",
  "status": "pending",
  "createdAt": "2023-06-15T10:30:00Z"
}
```

### Optional API Endpoints

These endpoints enhance the user experience but are not required for basic functionality:

#### 1. User Management

**POST /api/users/register**
- Description: Register a new user
- Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

**POST /api/users/login**
- Description: Authenticate a user
- Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword"
}
```
- Response:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### 2. User Orders

**GET /api/users/orders**
- Description: Retrieve orders for the authenticated user
- Headers: `Authorization: Bearer {token}`
- Response:
```json
[
  {
    "id": "ORD-2023-001",
    "status": "completed",
    "totalAmount": 205.97,
    "createdAt": "2023-06-15T10:30:00Z",
    "items": [
      {
        "productId": 1,
        "title": "Product Title",
        "quantity": 2
      }
    ]
  }
]
```

#### 3. Wishlist

**GET /api/users/wishlist**
- Description: Retrieve user's wishlist
- Headers: `Authorization: Bearer {token}`

**POST /api/users/wishlist**
- Description: Add item to wishlist
- Headers: `Authorization: Bearer {token}`
- Request Body:
```json
{
  "productId": 1
}
```

#### 4. Reviews

**GET /api/products/{id}/reviews**
- Description: Get reviews for a product
- Response:
```json
{
  "reviews": [
    {
      "id": 1,
      "productId": 1,
      "rating": 5,
      "comment": "Great product!",
      "author": "John Doe",
      "createdAt": "2023-06-10T09:00:00Z"
    }
  ]
}
```

**POST /api/products/{id}/reviews**
- Description: Add a review for a product
- Headers: `Authorization: Bearer {token}`
- Request Body:
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

### Java Backend Implementation Example

Here's an example of how to implement the essential endpoints in Java with Spring Boot:

#### Product Controller
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<ProductsResponse> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean featured) {
        
        Page<Product> products = productService.getProducts(
            page, limit, category, minPrice, maxPrice, search, sort, featured);
        
        ProductsResponse response = new ProductsResponse();
        response.setProducts(products.getContent());
        response.setCurrentPage(page);
        response.setTotalPages(products.getTotalPages());
        response.setTotalItems((int) products.getTotalElements());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        Product product = productService.findById(id)
            .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        
        ProductResponse response = new ProductResponse();
        response.setProduct(product);
        
        return ResponseEntity.ok(response);
    }
}
```

#### Order Controller
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        Order order = orderService.createOrder(orderRequest);
        
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

#### Category Controller
```java
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<CategoriesResponse> getCategories() {
        List<Category> categories = categoryService.findAll();
        
        CategoriesResponse response = new CategoriesResponse();
        response.setCategories(categories);
        
        return ResponseEntity.ok(response);
    }
}
```

### Database Schema Recommendations

For the Java backend, consider the following database schema:

```sql
-- Products table
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_first_name VARCHAR(100) NOT NULL,
    customer_last_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_address TEXT,
    customer_city VARCHAR(100),
    customer_state VARCHAR(100),
    customer_zip_code VARCHAR(20),
    customer_country VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    product_id BIGINT NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Error Handling

The backend should return appropriate HTTP status codes:

- `200 OK` - Successful requests
- `201 Created` - Successful creation
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Server errors

### Security Considerations

- Implement JWT-based authentication for user endpoints
- Validate all input parameters to prevent injection attacks
- Implement rate limiting for public endpoints
- Use HTTPS in production
- Validate and sanitize user inputs

### Testing

Include unit and integration tests for all API endpoints:

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ProductControllerTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldGetProducts() {
        ResponseEntity<ProductsResponse> response = 
            restTemplate.getForEntity("/api/products", ProductsResponse.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getProducts()).isNotEmpty();
    }
}
```

This comprehensive API specification provides everything needed to implement a Java backend that works seamlessly with this React frontend application.

## Docker Deployment

The application can be easily deployed using Docker. To build and run the application:

1. Build the Docker image:
```bash
docker build -t beast-shopping-app .
```

2. Run the container:
```bash
docker run -d -p 80:80 --name beast-shopping beast-shopping-app
```

3. Access the application at `http://localhost`

The Docker image uses a multi-stage build process:
- First stage: Builds the React application using Node.js
- Second stage: Serves the built application using Nginx for optimal performance
- Includes proper configuration for React Router client-side routing
- Enables gzip compression and caching for static assets
