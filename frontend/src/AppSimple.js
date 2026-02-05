import { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme, GlobalStyles } from './theme';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import SearchBar from './components/search/SearchBar';
import EnhancedProductCard from './components/product/EnhancedProductCard';
import Modal from './components/common/Modal';
import { ProductCardSkeleton } from './components/common/Loading';

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
  
  @media (min-width: ${theme.breakpoints.lg}) {
    padding-left: 324px;
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.primary[600]}, ${theme.colors.primary[400]});
  color: ${theme.colors.white};
  padding: ${theme.spacing[16]} ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
  text-align: center;
`;

const HeroTitle = styled(motion.h1)`
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  margin-bottom: ${theme.spacing[4]};
  text-shadow: ${theme.shadows.lg};
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${theme.typography.fontSize.xl};
  opacity: 0.9;
  margin-bottom: ${theme.spacing[6]};
`;

const SearchSection = styled.div`
  max-width: 600px;
  margin: 0 auto ${theme.spacing[8]};
`;

const FilterToggle = styled(motion.button)`
  background-color: ${theme.colors.white};
  border: 2px solid ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[700]};
  cursor: pointer;
  display: none;
  margin-bottom: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
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

const ResultsCount = styled.span`
  background-color: ${theme.colors.primary[100]};
  color: ${theme.colors.primary[700]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing[6]};
  
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

const EmptyStateIcon = styled.div`
  font-size: ${theme.typography.fontSize['5xl']};
  margin-bottom: ${theme.spacing[4]};
`;

const EmptyStateTitle = styled.h3`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[2]};
`;

const EmptyStateText = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[6]};
`;

const AppSimple = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState(0);
  const [recentSearches, setRecentSearches] = useState(['milk', 'eggs', 'rice', 'bread']);

  const mockSuggestions = searchQuery ? [
    { id: '1', name: 'Amul Milk', category: 'Dairy', minPrice: 50, image: null },
    { id: '2', name: 'Fresh Tomatoes', category: 'Vegetables', minPrice: 27, image: null },
    { id: '3', name: 'Basmati Rice', category: 'Grains', minPrice: 154, image: null }
  ].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) : [];

  const mockResults = selectedCategory || selectedBrands.length > 0 || searchQuery ? [
    {
      id: 'milk_amul_1l',
      name: 'Amul Milk',
      brand: 'Amul',
      category: 'Dairy',
      packageSize: '1 Liter',
      image: null,
      nutritionalInfo: { calories: 42, protein: 3.4, fat: 3.9, carbs: 5 },
      platforms: [
        { platform: 'Zepto', price: 52, available: true, deliveryTime: '15 mins' },
        { platform: 'Blinkit', price: 55, available: true, deliveryTime: '20 mins' },
        { platform: 'Instamart', price: 54, available: true, deliveryTime: '18 mins' }
      ]
    }
  ] : [];

  useEffect(() => {
    if (searchQuery || selectedCategory) {
      setLoading(true);
      setTimeout(() => {
        setResults(mockResults);
        setLoading(false);
      }, 1000);
    } else {
      setResults([]);
    }
  }, [searchQuery, selectedCategory, selectedBrands]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setRecentSearches(prev => [searchQuery, ...prev.filter(s => s !== searchQuery).slice(0, 4)]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion) {
      setSearchQuery(suggestion.name);
      setShowSuggestions(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCompare = (product) => {
    console.log('Compare product:', product);
  };

  const handleWishlist = (product) => {
    console.log('Add to wishlist:', product);
    setCartItems(prev => prev + 1);
  };

  const handleQuickView = (product) => {
    console.log('Quick view:', product);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleBrandChange = (brands) => {
    setSelectedBrands(brands);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onSearchSubmit={handleSearchSubmit}
          cartItems={cartItems}
          onCartClick={() => console.log('Cart clicked')}
          onMenuToggle={() => setShowSidebar(!showSidebar)}
          isMenuOpen={showSidebar}
        />

        <MainContent>
          <Sidebar
            isOpen={showSidebar}
            onClose={() => setShowSidebar(false)}
            categories={['Dairy', 'Vegetables', 'Fruits', 'Grains', 'Beverages', 'Packaged Foods']}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            brands={['Amul', 'Mother Dairy', 'India Gate', 'Fortune', 'Britannia', 'Fresh']}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
          />

          <ContentArea>
            <HeroSection>
              <HeroTitle
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                🛒 Grocery Price Compare
              </HeroTitle>
              <HeroSubtitle
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
              >
                Compare prices across Zepto, Blinkit & Instamart
              </HeroSubtitle>
              
              <SearchSection>
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearch}
                  onSubmit={handleSearchSubmit}
                  suggestions={mockSuggestions}
                  recentSearches={recentSearches}
                  showSuggestions={showSuggestions}
                  onSuggestionSelect={handleSuggestionSelect}
                  onClearRecent={handleClearRecent}
                  isLoading={loading}
                />
              </SearchSection>
            </HeroSection>

            <FilterToggle
              onClick={() => setShowSidebar(!showSidebar)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔍 Filters {selectedCategory && `(${selectedCategory})`}
            </FilterToggle>

            <ResultsSection>
              <AnimatePresence>
                {loading && (
                  <div>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                )}
              </AnimatePresence>

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
                    <ResultsCount>
                      {searchQuery && `for "${searchQuery}"`}
                    </ResultsCount>
                  </ResultsHeader>

                  <ProductGrid>
                    {results.map((product, index) => (
                      <EnhancedProductCard
                        key={product.id}
                        product={product}
                        onCompare={handleCompare}
                        onWishlist={handleWishlist}
                        onQuickView={handleProductClick}
                      />
                    ))}
                  </ProductGrid>
                </motion.div>
              )}
            </AnimatePresence>

              {!loading && results.length === 0 && (searchQuery || selectedCategory) && (
                <EmptyState>
                  <EmptyStateIcon>🔍</EmptyStateIcon>
                  <EmptyStateTitle>No products found</EmptyStateTitle>
                  <EmptyStateText>
                    Try adjusting your filters or search for something different
                  </EmptyStateText>
                </EmptyState>
              )}
            </ResultsSection>
          </ContentArea>
        </MainContent>

        <Footer />

        <AnimatePresence>
          {selectedProduct && (
            <Modal
              isOpen={true}
              onClose={() => setSelectedProduct(null)}
              title={selectedProduct.name}
              maxWidth="800px"
            >
              <div style={{ display: 'flex', gap: theme.spacing[6] }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: theme.spacing[3] }}>Product Information</h3>
                  <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  <p><strong>Package Size:</strong> {selectedProduct.packageSize}</p>
                  
                  <h4 style={{ marginTop: theme.spacing[4], marginBottom: theme.spacing[2] }}>Nutritional Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.spacing[3] }}>
                    <div>🔥 Calories: {selectedProduct.nutritionalInfo.calories}</div>
                    <div>🥩 Protein: {selectedProduct.nutritionalInfo.protein}g</div>
                    <div>🧈 Fat: {selectedProduct.nutritionalInfo.fat}g</div>
                    <div>🌾 Carbs: {selectedProduct.nutritionalInfo.carbs}g</div>
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: theme.spacing[3] }}>Price Comparison</h4>
                  {selectedProduct.platforms.map(platform => (
                    <div key={platform.platform} style={{
                      padding: theme.spacing[3],
                      marginBottom: theme.spacing[2],
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      borderRadius: theme.borderRadius.lg,
                      backgroundColor: platform.price === Math.min(...selectedProduct.platforms.map(p => p.price)) ? theme.colors.success[50] : 'white'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: theme.typography.fontWeight.semibold }}>{platform.platform}</span>
                        <span style={{ 
                          fontSize: theme.typography.fontSize.xl, 
                          fontWeight: theme.typography.fontWeight.bold,
                          color: platform.price === Math.min(...selectedProduct.platforms.map(p => p.price)) ? theme.colors.success[600] : theme.colors.neutral[800]
                        }}>
                          ₹{platform.price}
                        </span>
                      </div>
                      <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.neutral[600] }}>
                        {platform.available ? `✓ Available • ${platform.deliveryTime}` : '✗ Out of Stock'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </AppContainer>
    </ThemeProvider>
  );
};

export default AppSimple;
