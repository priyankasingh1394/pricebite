import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import { theme, GlobalStyles } from './theme';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import Contact from './components/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentLocation } from './store/slices/locationSlice';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.neutral[50]};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${theme.spacing[6]};
  padding-top: 80px;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing[20]} ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[10]};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    pointer-events: none;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: ${theme.typography.fontSize['5xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  margin-bottom: ${theme.spacing[6]};
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
  line-height: 1.1;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${theme.typography.fontSize['2xl']};
  opacity: 0.95;
  margin-bottom: ${theme.spacing[8]};
  font-weight: ${theme.typography.fontWeight.medium};
  letter-spacing: 0.01em;
`;

const SearchSection = styled.div`
  max-width: 700px;
  margin: 0 auto ${theme.spacing[10]};
  position: relative;
`;

const ResultsSection = styled.section`
  margin-bottom: ${theme.spacing[8]};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
`;

const ResultsTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[800]};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
  
  @media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[16]};
  color: ${theme.colors.neutral[600]};
`;

const FeaturesSection = styled.section`
  padding: ${theme.spacing[16]} ${theme.spacing[8]};
  background: white;
  margin-bottom: ${theme.spacing[10]};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[8]};
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: ${theme.spacing[8]};
  border-radius: 16px;
  background: ${theme.colors.neutral[50]};
  border: 1px solid ${theme.colors.neutral[200]};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing[4]};
`;

const FeatureTitle = styled.h3`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[4]};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.neutral[600]};
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${theme.spacing[16]} ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[10]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[8]};
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const StatCard = styled.div`
  padding: ${theme.spacing[6]};
`;

const StatNumber = styled.div`
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  margin-bottom: ${theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  opacity: 0.9;
`;

const LocationPrompt = styled(motion.div)`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
  text-align: center;
  color: #0c4a6e;
`;

const LocationButton = styled.button`
  background: #0ea5e9;
  color: white;
  border: none;
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border-radius: 8px;
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  margin-top: ${theme.spacing[4]};
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #0284c7;
  }
`;

// Homepage Component
const Homepage = () => {
  const dispatch = useDispatch();
  const { currentLocation, isLoading: locationLoading } = useSelector(state => state.location);
  // const { user, isAuthenticated } = useSelector(state => state.auth); // For future use

  useEffect(() => {
    if (!currentLocation && !locationLoading) {
      dispatch(getCurrentLocation());
    }
  }, [dispatch, currentLocation, locationLoading]);

  return (
    <>
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          🛒 PriceBite - Smart Grocery Comparison
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        >
          Instant price comparison for smarter grocery shopping
        </HeroSubtitle>
        
        {!currentLocation && !locationLoading && (
          <LocationPrompt
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>
              📍 Enable location for better prices and delivery estimates
            </div>
            <LocationButton onClick={() => dispatch(getCurrentLocation())}>
              Enable Location
            </LocationButton>
          </LocationPrompt>
        )}
      </HeroSection>

      <StatsSection>
        <StatsGrid>
          <StatCard>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Products</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>3</StatNumber>
            <StatLabel>Platforms</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Price Updates</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>₹500</StatNumber>
            <StatLabel>Avg. Savings</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>Real-time Search</FeatureTitle>
            <FeatureDescription>
              Search across multiple platforms instantly to find the best deals on groceries, dairy, vegetables, and more.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Price Comparison</FeatureTitle>
            <FeatureDescription>
              Compare prices from Zepto, Blinkit, and Instamart to ensure you always get the best value for your money.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>🚚</FeatureIcon>
            <FeatureTitle>Delivery Tracking</FeatureTitle>
            <FeatureDescription>
              Track delivery times and availability across platforms to get your groceries when you need them.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Nutritional Info</FeatureTitle>
            <FeatureDescription>
              Make informed choices with detailed nutritional information for all products in our database.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>📍</FeatureIcon>
            <FeatureTitle>Location-based</FeatureTitle>
            <FeatureDescription>
              Get accurate pricing and delivery estimates based on your current location for the best experience.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>👤</FeatureIcon>
            <FeatureTitle>Personalized</FeatureTitle>
            <FeatureDescription>
              Save your preferences, create shopping lists, and get personalized recommendations tailored to you.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </>
  );
};

// Product Search Component
const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle search function
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError('Please type a product name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5001/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.products.length === 0) {
        setError(`No results found for "${searchQuery}". Try: ${suggestions.slice(0, 3).join(', ')}`);
      } else {
        setResults(data.products);
      }
    } catch (err) {
      setError('Could not reach the backend. Is it running?');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, suggestions, setError, setLoading]);

  // Fetch product suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('http://localhost:5001/products/list');
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };
    fetchSuggestions();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setError('');
    }
  }, [searchQuery, handleSearch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          🛒 Search Products
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        >
          Compare prices across multiple platforms
        </HeroSubtitle>
        
        <SearchSection>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="🔍 Search for groceries, dairy, vegetables & more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '20px 24px',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                outline: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '20px',
                padding: '20px 40px',
                backgroundColor: loading ? '#ccc' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </SearchSection>
      </HeroSection>

      <ContentArea>
        <ResultsSection>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>🔍 Searching for best deals...</div>
              <div style={{ fontSize: '14px' }}>Comparing prices across platforms</div>
            </div>
          )}

          {error && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: '#e74c3c',
              backgroundColor: '#fdf2f2',
              borderRadius: '8px',
              border: '1px solid #f5c6cb',
              margin: '20px 0'
            }}>
              {error}
            </div>
          )}

          {!loading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ResultsHeader>
                <ResultsTitle>
                  {results.length} Products Found
                </ResultsTitle>
              </ResultsHeader>

              <ProductGrid>
                {results.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: index * 0.1 }}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '16px',
                      padding: '28px',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    whileHover={{ y: -4, boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Product card content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ 
                          fontSize: '22px', 
                          fontWeight: 'bold', 
                          color: '#2c3e50', 
                          marginBottom: '8px',
                          lineHeight: '1.2'
                        }}>
                          {product.name}
                        </h3>
                        <div style={{ 
                          fontSize: '15px', 
                          color: '#666', 
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{ 
                            backgroundColor: '#f0f0f0',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'medium'
                          }}>
                            {product.brand}
                          </span>
                          <span>{product.category}</span>
                          <span style={{ 
                            color: '#2563eb',
                            fontWeight: 'medium'
                          }}>
                            ₹{product.unitPrice}/{product.unit}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#666', 
                          marginBottom: '8px',
                          fontWeight: 'medium'
                        }}>
                          💰 Best Price: <span style={{ color: '#2563eb', fontWeight: 'bold' }}>₹{Math.min(...product.platforms.map(p => p.price))}</span>
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#888', 
                          marginBottom: '12px'
                        }}>
                          🚚 Fastest Delivery: <span style={{ fontWeight: 'medium' }}>
                            {product.platforms.find(p => p.available)?.deliveryTime || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        gap: '6px', 
                        flexWrap: 'wrap', 
                        marginBottom: '16px'
                      }}>
                        {product.platforms.map(platform => (
                          <div
                            key={platform.platform}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              backgroundColor: platform.available ? '#e8f5e8' : '#ffebee',
                              color: platform.available ? '#2e7d32' : '#c62828',
                              border: platform.price === Math.min(...product.platforms.map(p => p.price)) ? '2px solid #4caf50' : '1px solid #e0e0e0',
                              fontWeight: 'medium'
                            }}
                          >
                            {platform.platform}: ₹{platform.price}
                          </div>
                        ))}
                      </div>

                      <div style={{ 
                        marginTop: 'auto',
                        paddingTop: '16px', 
                        borderTop: '1px solid #e0e0e0', 
                        fontSize: '12px', 
                        color: '#666',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '6px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>🔥</span>
                          <span>{product.nutritionalInfo.calories} cal</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>🥩</span>
                          <span>{product.nutritionalInfo.protein}g</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>🧈</span>
                          <span>{product.nutritionalInfo.fat}g</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>🌾</span>
                          <span>{product.nutritionalInfo.carbs}g</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </ProductGrid>
            </motion.div>
          )}

          {!loading && results.length === 0 && searchQuery && (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                No products found
              </h3>
              <p style={{ fontSize: '16px', color: '#666' }}>
                Try searching for something different
              </p>
            </EmptyState>
          )}

          {!loading && !searchQuery && (
            <EmptyState>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                Start Searching
              </h3>
              <p style={{ fontSize: '16px', color: '#666' }}>
                Search for products to compare prices across multiple platforms
              </p>
            </EmptyState>
          )}
        </ResultsSection>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            {/* Modal content from previous implementation */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '800px',
              width: '95%',
              maxHeight: '85vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
            }}>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>

              {/* Product Header */}
              <div style={{ 
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#2c3e50',
                  marginBottom: '12px',
                  lineHeight: '1.2'
                }}>
                  {selectedProduct.name}
                </h2>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '12px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ 
                    backgroundColor: '#f0f9ff',
                    color: '#2563eb',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'medium'
                  }}>
                    {selectedProduct.brand}
                  </span>
                  <span style={{ 
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    {selectedProduct.category}
                  </span>
                  <span style={{ 
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'medium'
                  }}>
                    {selectedProduct.packageSize}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  color: '#2563eb',
                  fontWeight: 'bold'
                }}>
                  💰 Unit Price: ₹{selectedProduct.unitPrice} per {selectedProduct.unit}
                </div>
              </div>

              {/* Price Comparison and other modal content */}
              {/* ... (rest of the modal implementation from before) */}
            </div>
          </div>
        )}
      </ContentArea>
    </>
  );
};

// Main App Component with Routing
function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppContainer>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/products" element={<ProductSearch />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div>Profile Page (Coming Soon)</div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </ThemeProvider>
    </Router>
  );
}

export default App;
