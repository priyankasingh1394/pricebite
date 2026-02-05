const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pricebite', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  city: String,
  dietaryPreferences: [String],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'pricebite-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, city, dietaryPreferences } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      dietaryPreferences
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        city: newUser.city,
        dietaryPreferences: newUser.dietaryPreferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        dietaryPreferences: user.dietaryPreferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, just return success
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        dietaryPreferences: user.dietaryPreferences
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, city, dietaryPreferences } = req.body;
    const userId = req.user.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, city, dietaryPreferences },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        dietaryPreferences: updatedUser.dietaryPreferences
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Contact Form Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    // In a real app, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Create support ticket
    
    console.log('Contact form submission:', { name, email, subject, category, message });

    // Simulate processing
    setTimeout(() => {
      res.json({
        message: 'Contact form submitted successfully',
        ticketId: `TICKET-${Date.now()}`
      });
    }, 1000);

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// API Endpoints
const products = {
  // Dairy Products
  'milk_amul_1l': {
    id: 'milk_amul_1l',
    name: 'Milk',
    brand: 'Amul',
    category: 'Dairy',
    packageSize: '1 Liter',
    unitPrice: 52,
    unit: 'per liter',
    nutritionalInfo: {
      calories: 42,
      protein: 3.4,
      fat: 3.9,
      carbs: 5
    },
    platforms: [
      { platform: 'Zepto', price: 52, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 55, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 54, available: true, deliveryTime: '18 mins' }
    ]
  },
  'milk_motherdairy_1l': {
    id: 'milk_motherdairy_1l',
    name: 'Milk',
    brand: 'Mother Dairy',
    category: 'Dairy',
    packageSize: '1 Liter',
    unitPrice: 50,
    unit: 'per liter',
    nutritionalInfo: {
      calories: 45,
      protein: 3.2,
      fat: 4.0,
      carbs: 4.8
    },
    platforms: [
      { platform: 'Zepto', price: 50, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 52, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 51, available: false, deliveryTime: 'N/A' }
    ]
  },
  'eggs_amul_12pcs': {
    id: 'eggs_amul_12pcs',
    name: 'Eggs',
    brand: 'Amul',
    category: 'Dairy',
    packageSize: '12 Pieces',
    unitPrice: 89,
    unit: 'per dozen',
    nutritionalInfo: {
      calories: 155,
      protein: 13,
      fat: 11,
      carbs: 1.1
    },
    platforms: [
      { platform: 'Zepto', price: 89, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 92, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 87, available: true, deliveryTime: '18 mins' }
    ]
  },
  'butter_amul_500g': {
    id: 'butter_amul_500g',
    name: 'Butter',
    brand: 'Amul',
    category: 'Dairy',
    packageSize: '500g',
    unitPrice: 245,
    unit: 'per 500g',
    nutritionalInfo: {
      calories: 717,
      protein: 0.9,
      fat: 81,
      carbs: 0.1
    },
    platforms: [
      { platform: 'Zepto', price: 245, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 248, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 242, available: true, deliveryTime: '18 mins' }
    ]
  },
  
  // Vegetables
  'tomatoes_fresh_1kg': {
    id: 'tomatoes_fresh_1kg',
    name: 'Tomatoes',
    brand: 'Fresh',
    category: 'Vegetables',
    packageSize: '1 kg',
    unitPrice: 28,
    unit: 'per kg',
    nutritionalInfo: {
      calories: 18,
      protein: 0.9,
      fat: 0.2,
      carbs: 3.9
    },
    platforms: [
      { platform: 'Zepto', price: 28, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 30, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 27, available: true, deliveryTime: '18 mins' }
    ]
  },
  'onions_fresh_1kg': {
    id: 'onions_fresh_1kg',
    name: 'Onions',
    brand: 'Fresh',
    category: 'Vegetables',
    packageSize: '1 kg',
    unitPrice: 35,
    unit: 'per kg',
    nutritionalInfo: {
      calories: 40,
      protein: 1.1,
      fat: 0.1,
      carbs: 9.3
    },
    platforms: [
      { platform: 'Zepto', price: 35, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 38, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 34, available: true, deliveryTime: '18 mins' }
    ]
  },
  'potatoes_fresh_1kg': {
    id: 'potatoes_fresh_1kg',
    name: 'Potatoes',
    brand: 'Fresh',
    category: 'Vegetables',
    packageSize: '1 kg',
    unitPrice: 22,
    unit: 'per kg',
    nutritionalInfo: {
      calories: 77,
      protein: 2,
      fat: 0.1,
      carbs: 17
    },
    platforms: [
      { platform: 'Zepto', price: 22, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 24, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 21, available: true, deliveryTime: '18 mins' }
    ]
  },
  
  // Grains & Staples
  'rice_basmati_1kg': {
    id: 'rice_basmati_1kg',
    name: 'Basmati Rice',
    brand: 'India Gate',
    category: 'Grains',
    packageSize: '1 kg',
    unitPrice: 156,
    unit: 'per kg',
    nutritionalInfo: {
      calories: 347,
      protein: 8,
      fat: 0.6,
      carbs: 77
    },
    platforms: [
      { platform: 'Zepto', price: 156, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 159, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 154, available: true, deliveryTime: '18 mins' }
    ]
  },
  'oil_sunflower_1l': {
    id: 'oil_sunflower_1l',
    name: 'Sunflower Oil',
    brand: 'Fortune',
    category: 'Grains',
    packageSize: '1 Liter',
    unitPrice: 189,
    unit: 'per liter',
    nutritionalInfo: {
      calories: 884,
      protein: 0,
      fat: 100,
      carbs: 0
    },
    platforms: [
      { platform: 'Zepto', price: 189, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 192, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 186, available: true, deliveryTime: '18 mins' }
    ]
  },
  'sugar_refined_1kg': {
    id: 'sugar_refined_1kg',
    name: 'Sugar',
    brand: 'Madhur',
    category: 'Grains',
    packageSize: '1 kg',
    unitPrice: 42,
    unit: 'per kg',
    nutritionalInfo: {
      calories: 387,
      protein: 0,
      fat: 0,
      carbs: 100
    },
    platforms: [
      { platform: 'Zepto', price: 42, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 45, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 41, available: true, deliveryTime: '18 mins' }
    ]
  },
  
  // Beverages
  'tea_brookebond_250g': {
    id: 'tea_brookebond_250g',
    name: 'Tea',
    brand: 'Brooke Bond',
    category: 'Beverages',
    packageSize: '250g',
    unitPrice: 128,
    unit: 'per 250g',
    nutritionalInfo: {
      calories: 1,
      protein: 0,
      fat: 0,
      carbs: 0
    },
    platforms: [
      { platform: 'Zepto', price: 128, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 132, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 125, available: true, deliveryTime: '18 mins' }
    ]
  },
  'coffee_nescafe_100g': {
    id: 'coffee_nescafe_100g',
    name: 'Coffee',
    brand: 'Nescafé',
    category: 'Beverages',
    packageSize: '100g',
    unitPrice: 245,
    unit: 'per 100g',
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0
    },
    platforms: [
      { platform: 'Zepto', price: 245, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 248, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 242, available: true, deliveryTime: '18 mins' }
    ]
  },
  
  // Packaged Foods
  'bread_britannia_400g': {
    id: 'bread_britannia_400g',
    name: 'Bread',
    brand: 'Britannia',
    category: 'Packaged Foods',
    packageSize: '400g',
    unitPrice: 35,
    unit: 'per 400g',
    nutritionalInfo: {
      calories: 265,
      protein: 9,
      fat: 3.2,
      carbs: 49
    },
    platforms: [
      { platform: 'Zepto', price: 35, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 38, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 36, available: true, deliveryTime: '18 mins' }
    ]
  },
  
  // Fruits
  'apples_fresh_1kg': {
    id: 'apples_fresh_1kg',
    name: 'Apples',
    brand: 'Fresh',
    category: 'Fruits',
    packageSize: '1 kg',
    unitPrice: 120,
    unit: 'per kg',
    nutritionalInfo: {
      calories: 52,
      protein: 0.3,
      fat: 0.2,
      carbs: 14
    },
    platforms: [
      { platform: 'Zepto', price: 120, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 125, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 118, available: true, deliveryTime: '18 mins' }
    ]
  },
  'bananas_fresh_1dozen': {
    id: 'bananas_fresh_1dozen',
    name: 'Bananas',
    brand: 'Fresh',
    category: 'Fruits',
    packageSize: '12 Pieces',
    unitPrice: 40,
    unit: 'per dozen',
    nutritionalInfo: {
      calories: 89,
      protein: 1.1,
      fat: 0.3,
      carbs: 23
    },
    platforms: [
      { platform: 'Zepto', price: 40, available: true, deliveryTime: '15 mins' },
      { platform: 'Blinkit', price: 42, available: true, deliveryTime: '20 mins' },
      { platform: 'Instamart', price: 38, available: true, deliveryTime: '18 mins' }
    ]
  }
};

// Helper functions
const getAllCategories = () => {
  const categories = [...new Set(Object.values(products).map(product => product.category))];
  return categories;
};

const getAllBrands = () => {
  const brands = [...new Set(Object.values(products).map(product => product.brand))];
  return brands;
};

const searchProducts = (query = '', category = '', brand = '') => {
  let results = Object.values(products);
  
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
  }
  
  if (category) {
    results = results.filter(product => product.category === category);
  }
  
  if (brand) {
    results = results.filter(product => product.brand === brand);
  }
  
  return results;
};

const getProductsByCategory = (category) => {
  return Object.values(products).filter(product => product.category === category);
};

// API Endpoints

// Get all categories
app.get('/categories', (req, res) => {
  const categories = getAllCategories();
  return res.json(categories);
});

// Get all brands
app.get('/brands', (req, res) => {
  const brands = getAllBrands();
  return res.json(brands);
});

// Get products by category
app.get('/products/category/:category', (req, res) => {
  const { category } = req.params;
  const categoryProducts = getProductsByCategory(category);
  
  if (categoryProducts.length === 0) {
    return res.status(404).json({ error: 'No products found in this category.' });
  }
  
  return res.json(categoryProducts);
});

// Advanced search endpoint
app.get('/products/search', (req, res) => {
  const { q: query = '', category = '', brand = '' } = req.query;
  const searchResults = searchProducts(query, category, brand);
  
  // Calculate additional metadata
  const categories = [...new Set(searchResults.map(p => p.category))];
  const brands = [...new Set(searchResults.map(p => p.brand))];
  const prices = searchResults.flatMap(p => p.platforms.map(pl => pl.price));
  const priceRange = prices.length > 0 ? {
    min: Math.min(...prices),
    max: Math.max(...prices)
  } : { min: 0, max: 0 };
  
  return res.json({
    products: searchResults,
    totalCount: searchResults.length,
    categories,
    brands,
    priceRange
  });
});

// Get all available products (legacy endpoint)
app.get('/products/list', (req, res) => {
  const productNames = [...new Set(Object.values(products).map(product => product.name))];
  return res.json(productNames);
});

// Get specific product by ID
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products[id];
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  
  return res.json(product);
});

// Legacy endpoint for backward compatibility
app.get('/products', (req, res) => {
  const name = (req.query.name || '').toLowerCase().trim();

  if (!name) {
    return res.status(400).json({ error: 'Please provide a product name.' });
  }

  // Search for products matching the name
  const matchingProducts = searchProducts(name);
  
  if (matchingProducts.length === 0) {
    return res.json([]);
  }
  
  // Return platform comparison for first matching product (legacy behavior)
  const firstProduct = matchingProducts[0];
  return res.json(firstProduct.platforms);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
