import { useState, useEffect, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import { theme, GlobalStyles } from './theme';

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

export default function App() {
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
      // Use the search endpoint to get complete product information
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
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <MainContent>
          <ContentArea>
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
            </ResultsSection>

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
          </ContentArea>
        </MainContent>
      </AppContainer>

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
            {/* Close Button */}
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

            {/* Nutritional Information */}
            <div style={{ 
              marginBottom: '32px',
              padding: '24px',
              backgroundColor: '#fef3c7',
              borderRadius: '16px',
              border: '1px solid #fca5a5'
            }}>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#dc2626',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🥗 Nutritional Information
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '20px' 
              }}>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔥</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Calories</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                    {selectedProduct.nutritionalInfo.calories} kcal
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                    Daily Value: {Math.round((selectedProduct.nutritionalInfo.calories / 2000) * 100)}%
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🥩</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Protein</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                    {selectedProduct.nutritionalInfo.protein}g
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                    Builds muscle & tissue
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧈</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Fat</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                    {selectedProduct.nutritionalInfo.fat}g
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                    Energy storage
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌾</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Carbohydrates</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>
                    {selectedProduct.nutritionalInfo.carbs}g
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                    Primary energy source
                  </div>
                </div>
              </div>
            </div>

            {/* Price Comparison */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#2c3e50',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                💰 Platform Price Comparison
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedProduct.platforms.map(platform => {
                  const cheapestPrice = Math.min(...selectedProduct.platforms.map(p => p.price));
                  const isCheapest = platform.price === cheapestPrice;
                  
                  return (
                    <div
                      key={platform.platform}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px',
                        border: `2px solid ${isCheapest ? '#10b981' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        backgroundColor: isCheapest ? '#ecfdf5' : 'white',
                        boxShadow: isCheapest ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: isCheapest ? '#059669' : '#2c3e50'
                        }}>
                          {platform.platform}
                          {isCheapest && (
                            <span style={{
                              marginLeft: '8px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '12px'
                            }}>
                              ⭐ BEST PRICE
                            </span>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isCheapest ? '#059669' : '#666'
                        }}>
                          {platform.available ? `✓ Available • ${platform.deliveryTime}` : '✗ Out of Stock'}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: isCheapest ? '#059669' : '#2c3e50',
                        textAlign: 'right'
                      }}>
                        ₹{platform.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Savings Calculation */}
            {selectedProduct.platforms.length > 1 && (
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '24px',
                borderRadius: '16px',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  💎 Smart Savings Alert
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  You save ₹{Math.max(...selectedProduct.platforms.map(p => p.price)) - Math.min(...selectedProduct.platforms.map(p => p.price))}
                </div>
                <div style={{ 
                  fontSize: '16px',
                  opacity: 0.9
                }}>
                  by choosing the cheapest option!
                </div>
                <div style={{ 
                  fontSize: '14px',
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  display: 'inline-block'
                }}>
                  🎯 Smart choice! You save {Math.max(...selectedProduct.platforms.map(p => p.price)) - Math.min(...selectedProduct.platforms.map(p => p.price))} rupees!
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}
