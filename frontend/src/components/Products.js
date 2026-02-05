import React, { useState, useEffect, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';
import { theme, GlobalStyles } from '../theme';

const ProductsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
`;

const ProductsHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const ProductsTitle = styled(motion.h1)`
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${theme.colors.neutral[800]};
  margin-bottom: ${theme.spacing[4]};
  text-shadow: ${theme.shadows.lg};
`;

const ProductsSubtitle = styled(motion.p)`
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[8]};
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

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

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
      
      if (data && data.error) {
        setError(data.error);
      } else if (data && data.products && data.products.length === 0) {
        setError(`No results found for "${searchQuery}". Try: ${suggestions.slice(0, 3).join(', ')}`);
      } else if (data && data.products) {
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

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ProductsContainer>
        <ProductsHeader>
          <ProductsTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            🛒 Products Catalog
          </ProductsTitle>
          <ProductsSubtitle
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
          >
            Browse our complete product database
          </ProductsSubtitle>
        </ProductsHeader>

        <SearchSection>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <input
              type="text"
              placeholder="🔍 Search products in our catalog..."
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
              style={{
                marginTop: '20px',
                padding: '20px 40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
              }}
            >
              {loading ? 'Searching...' : 'Search Products'}
            </button>
          </form>
        </SearchSection>

        <ResultsSection>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '18px', color: '#666' }}>Loading products...</div>
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
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ y: -4, boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}
                  >
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                        {product.name}
                      </h3>
                      <p style={{ fontSize: '15px', color: '#666', marginBottom: '8px' }}>
                        {product.brand} • {product.category}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Price Range:</span>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' }}>
                          ₹{Math.min(...product.platforms.map(p => p.price))} - ₹{Math.max(...product.platforms.map(p => p.price))}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {product.platforms.map(platform => (
                          <div
                            key={platform.platform}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '16px',
                              fontSize: '12px',
                              backgroundColor: platform.available ? '#e8f5e8' : '#ffebee',
                              color: platform.available ? '#2e7d32' : '#c62828',
                              border: platform.price === Math.min(...product.platforms.map(p => p.price)) ? '2px solid #4caf50' : '1px solid #e0e0e0'
                            }}
                          >
                            {platform.platform}: ₹{platform.price}
                          </div>
                        ))}
                      </div>
                      <div style={{ 
                        marginTop: '12px', 
                        paddingTop: '12px', 
                        borderTop: '1px solid #e0e0e0', 
                        fontSize: '12px', 
                        color: '#666',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '4px'
                      }}>
                        <div>🔥 {product.nutritionalInfo.calories} cal</div>
                        <div>🥩 {product.nutritionalInfo.protein}g protein</div>
                        <div>🧈 {product.nutritionalInfo.fat}g fat</div>
                        <div>🌾 {product.nutritionalInfo.carbs}g carbs</div>
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
                Welcome to Products Catalog
              </h3>
              <p style={{ fontSize: '16px', color: '#666' }}>
                Search for products to compare prices across multiple platforms
              </p>
            </EmptyState>
          )}
        </ResultsSection>
      </ProductsContainer>
    </ThemeProvider>
  );
};

export default Products;
