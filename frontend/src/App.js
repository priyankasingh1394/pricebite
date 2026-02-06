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
import CategorySelector from './components/CategorySelector';
import HotDeals from './components/HotDeals';
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%);
  padding: 120px 20px 80px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
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
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${theme.typography.fontSize['xl']};
  margin-bottom: ${theme.spacing[8]};
  opacity: 0.9;
  font-weight: 300;
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

const FeaturesSection = styled.section`
  padding: 60px 32px;
  background: white;
  margin-bottom: 40px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 32px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 32px;
  margin-bottom: 40px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const StatCard = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 18px;
  opacity: 0.9;
`;

const LocationPrompt = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin: 32px auto 0;
  max-width: 400px;
  text-align: center;
  color: white;
  backdrop-filter: blur(10px);
`;

const LocationButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
  }
`;

const FilterInfo = styled.span`
  color: #2563eb;
  font-weight: 500;
`;

// Filter Components used in CategoryFilterBar
const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const FilterTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// New Product Search Styled Components
const SearchHeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%);
  padding: 80px 20px 60px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    pointer-events: none;
  }
`;

const SearchHeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SearchHeroTitle = styled(motion.h1)`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
`;

const SearchHeroSubtitle = styled(motion.p)`
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
  font-weight: 300;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const SearchForm = styled.form`
  margin-bottom: 20px;
`;

const SearchInputGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchInputField = styled.input`
  flex: 1;
  padding: 18px 24px;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  outline: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const SearchButton = styled.button`
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActiveFiltersBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
`;

const FilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ClearIcon = styled.span`
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const SearchContentArea = styled.div`
  flex: 1;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const CategoryFilterBar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const CategoryToggle = styled.button`
  background: ${props => props.isActive ? '#667eea' : '#f8fafc'};
  color: ${props => props.isActive ? 'white' : '#667eea'};
  border: 2px solid #667eea;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.isActive ? '#5a67d8' : '#e2e8f0'};
    transform: translateY(-1px);
  }
`;

const ResultsContainer = styled.div`
  min-height: 400px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #666;
`;

const LoadingSpinner = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #e74c3c;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const ErrorText = styled.div`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
`;

const SearchResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
`;

const ResultsCount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const ResultsNumber = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
`;

const ResultsText = styled.span`
  font-size: 18px;
  color: #6b7280;
  font-weight: 500;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 380px;
  
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }
`;

const ProductHeader = styled.div`
  margin-bottom: 16px;
`;

const ProductTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.3;
`;

const ProductBrand = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.span`
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const SubcategoryBadge = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const PriceInfo = styled.span`
  background: #dcfce7;
  color: #166534;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const PriceComparison = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
`;

const BestPrice = styled.div`
  text-align: left;
`;

const BestPriceLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const BestPriceValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #059669;
`;

const DeliveryInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const PlatformList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const PlatformChip = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid ${props => props.isBest ? '#10b981' : '#e5e7eb'};
  background: ${props => props.isBest ? '#ecfdf5' : props.isAvailable ? '#f8fafc' : '#fef2f2'};
  transition: all 0.2s ease;
`;

const PlatformName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.isAvailable ? '#1f2937' : '#9ca3af'};
`;

const PlatformPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.isBest ? '#059669' : props.isAvailable ? '#1f2937' : '#9ca3af'};
`;

const NutritionalInfo = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const NutriLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 600;
`;

const NutriGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const NutriItem = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const SearchEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #6b7280;
  max-width: 400px;
`;

// Modal Components
const ProductModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 40px;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

const ModalClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f3f4f6;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e5e7eb;
    color: #1f2937;
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const ModalTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const ModalBrand = styled.div`
  font-size: 18px;
  color: #6b7280;
  font-weight: 500;
`;

const ModalMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const ModalCategory = styled.span`
  background: #e0e7ff;
  color: #3730a3;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
`;

const ModalSubcategory = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
`;

const ModalPackage = styled.span`
  background: #dcfce7;
  color: #166534;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
`;

const ModalPrice = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const ModalPriceLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const ModalPriceValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #059669;
`;

const PlatformComparison = styled.div`
  margin-bottom: 32px;
`;

const ComparisonTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  text-align: center;
`;

const PlatformRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  margin-bottom: 8px;
`;

const PlatformRowName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const PlatformRowPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #059669;
`;

const PlatformRowStatus = styled.span`
  font-size: 14px;
  color: ${props => props.available ? '#059669' : '#dc2626'};
  font-weight: 500;
`;

const SavingsCalculation = styled.div`
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-radius: 16px;
`;

const SavingsTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #059669;
  margin-bottom: 12px;
`;

const SavingsAmount = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #059669;
  margin-bottom: 8px;
`;

const SavingsPercentage = styled.div`
  font-size: 16px;
  color: #047857;
  font-weight: 600;
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
    <ContentArea>
      {/* Hero Section */}
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

      {/* Hot Deals Section */}
      <HotDeals />

      {/* Category Selection */}
      <CategorySelector />

      {/* Stats Section */}
      <StatsSection>
        <StatsGrid>
          <StatCard>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Products</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>8</StatNumber>
            <StatLabel>Categories</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>15+</StatNumber>
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

      {/* Features Section */}
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
              Search across multiple platforms instantly to find best deals on groceries, electronics, fashion, home & kitchen, beauty products, and more.
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
              Compare prices from Amazon, Flipkart, Myntra, Zepto, Blinkit, Instamart and more to ensure you always get the best value for your money.
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
              Track delivery times and availability across platforms to get your products when you need them.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Category-wise Search</FeatureTitle>
            <FeatureDescription>
              Browse products by categories like Grocery, Electronics, Fashion, Home & Kitchen, Beauty, Sports, Books, Toys and more.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>�</FeatureIcon>
            <FeatureTitle>Hot Deals</FeatureTitle>
            <FeatureDescription>
              Discover verified deals with massive savings across all categories. Updated 24/7 with real price tracking.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -4 }}
          >
            <FeatureIcon>�</FeatureIcon>
            <FeatureTitle>Location-based</FeatureTitle>
            <FeatureDescription>
              Get accurate pricing and delivery estimates based on your current location for the best experience.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </ContentArea>
  );
};

// Product Search Component
const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetch('http://localhost:5001/categories')
      .then(res => res.json())
      .then(data => {
        // setCategories(data); // Future use for category dropdown
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Handle search function
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError('Please type a product name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        category: selectedCategory,
        subcategory: selectedSubcategory
      });
      
      const res = await fetch(`http://localhost:5001/products/search?${params}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.products.length === 0) {
        setError(`No results found for "${searchQuery}". Try different keywords or categories.`);
      } else {
        setResults(data.products);
      }
    } catch (err) {
      setError('Could not reach the backend. Is it running?');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  // Fetch product suggestions on mount
  useEffect(() => {
    fetch('http://localhost:5001/products/list')
      .then(res => res.json())
      .then(data => {
        // setSuggestions(data); // Future use for autocomplete
      })
      .catch(err => console.error('Failed to fetch suggestions:', err));
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setShowCategorySelector(false);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
  };

  const activeFilters = selectedCategory || selectedSubcategory;

  return (
    <>
      <SearchHeroSection>
        <SearchHeroContent>
          <SearchHeroTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            🔍 Smart Product Search
          </SearchHeroTitle>
          <SearchHeroSubtitle
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
          >
            Compare prices across 15+ platforms and 8 categories
          </SearchHeroSubtitle>
          
          <SearchContainer>
            <SearchForm onSubmit={handleFormSubmit}>
              <SearchInputGroup>
                <SearchInputField
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchButton type="submit" disabled={loading}>
                  {loading ? '🔄' : '🔍'}
                </SearchButton>
              </SearchInputGroup>
            </SearchForm>
            
            {activeFilters && (
              <ActiveFiltersBar>
                <FilterLabel>Active Filters:</FilterLabel>
                <FilterChip>
                  {selectedCategory || 'All Categories'}
                  <ClearIcon onClick={clearFilters}>✕</ClearIcon>
                </FilterChip>
                {selectedSubcategory && (
                  <FilterChip>
                    {selectedSubcategory}
                    <ClearIcon onClick={() => setSelectedSubcategory('')}>✕</ClearIcon>
                  </FilterChip>
                )}
              </ActiveFiltersBar>
            )}
          </SearchContainer>
        </SearchHeroContent>
      </SearchHeroSection>

      <SearchContentArea>
        {/* Category Filter Section */}
        <CategoryFilterBar>
          <FilterHeader>
            <FilterTitle>🏷️ Browse Categories</FilterTitle>
            <FilterActions>
              <CategoryToggle
                onClick={() => setShowCategorySelector(!showCategorySelector)}
                isActive={showCategorySelector}
              >
                {showCategorySelector ? 'Hide Categories' : 'Show Categories'}
              </CategoryToggle>
            </FilterActions>
          </FilterHeader>
          
          {showCategorySelector && (
            <CategorySelector 
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategoryChange={handleCategoryChange}
              onSubcategoryChange={handleSubcategoryChange}
            />
          )}
        </CategoryFilterBar>

        {/* Results Section */}
        <ResultsContainer>
          {loading && (
            <LoadingState>
              <LoadingSpinner>🔄</LoadingSpinner>
              <LoadingText>Finding best deals across platforms...</LoadingText>
            </LoadingState>
          )}

          {error && !loading && (
            <ErrorState>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorText>{error}</ErrorText>
            </ErrorState>
          )}

          {!loading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SearchResultsHeader>
                <ResultsCount>
                  <ResultsNumber>{results.length}</ResultsNumber>
                  <ResultsText>Products Found</ResultsText>
                </ResultsCount>
                {activeFilters && (
                  <FilterInfo>in {selectedCategory}{selectedSubcategory ? ` > ${selectedSubcategory}` : ''}</FilterInfo>
                )}
              </SearchResultsHeader>

              <ProductGrid>
                {results.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleProductClick(product)}
                  >
                    <ProductHeader>
                      <ProductTitle>{product.name}</ProductTitle>
                      <ProductBrand>{product.brand}</ProductBrand>
                    </ProductHeader>
                    
                    <ProductMeta>
                      <CategoryBadge>{product.category}</CategoryBadge>
                      {product.subcategory && (
                        <SubcategoryBadge>{product.subcategory}</SubcategoryBadge>
                      )}
                      <PriceInfo>₹{product.unitPrice}/{product.unit}</PriceInfo>
                    </ProductMeta>

                    <PriceComparison>
                      <BestPrice>
                        <BestPriceLabel>Best Price</BestPriceLabel>
                        <BestPriceValue>₹{Math.min(...product.platforms.map(p => p.price))}</BestPriceValue>
                      </BestPrice>
                      <DeliveryInfo>
                        🚚 {product.platforms.find(p => p.available)?.deliveryTime || 'N/A'}
                      </DeliveryInfo>
                    </PriceComparison>

                    <PlatformList>
                      {product.platforms.map(platform => (
                        <PlatformChip
                          key={platform.platform}
                          isBest={platform.price === Math.min(...product.platforms.map(p => p.price))}
                          isAvailable={platform.available}
                        >
                          <PlatformName>{platform.platform}</PlatformName>
                          <PlatformPrice>₹{platform.price}</PlatformPrice>
                        </PlatformChip>
                      ))}
                    </PlatformList>

                    {product.nutritionalInfo && (
                      <NutritionalInfo>
                        <NutriLabel>Nutrition</NutriLabel>
                        <NutriGrid>
                          <NutriItem>🔥 {product.nutritionalInfo.calories} cal</NutriItem>
                          <NutriItem>🥩 {product.nutritionalInfo.protein}g</NutriItem>
                          <NutriItem>🧈 {product.nutritionalInfo.fat}g</NutriItem>
                          <NutriItem>🌾 {product.nutritionalInfo.carbs}g</NutriItem>
                        </NutriGrid>
                      </NutritionalInfo>
                    )}
                  </ProductCard>
                ))}
              </ProductGrid>
            </motion.div>
          )}

          {!loading && results.length === 0 && searchQuery && (
            <SearchEmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>No products found</EmptyTitle>
              <EmptyText>Try searching for something different or browse categories</EmptyText>
            </SearchEmptyState>
          )}

          {!loading && !searchQuery && (
            <SearchEmptyState>
              <EmptyIcon>🛒</EmptyIcon>
              <EmptyTitle>Start Searching</EmptyTitle>
              <EmptyText>Search for products to compare prices across multiple platforms</EmptyText>
            </SearchEmptyState>
          )}
        </ResultsContainer>

        {/* Product Details Modal */}
        {selectedProduct && (
          <ProductModal>
            <ModalOverlay onClick={() => setSelectedProduct(null)} />
            <ModalContent>
              <ModalClose onClick={() => setSelectedProduct(null)}>✕</ModalClose>
              
              <ModalHeader>
                <ModalTitle>{selectedProduct.name}</ModalTitle>
                <ModalBrand>{selectedProduct.brand}</ModalBrand>
              </ModalHeader>

              <ModalMeta>
                <ModalCategory>{selectedProduct.category}</ModalCategory>
                {selectedProduct.subcategory && (
                  <ModalSubcategory>{selectedProduct.subcategory}</ModalSubcategory>
                )}
                <ModalPackage>{selectedProduct.packageSize}</ModalPackage>
              </ModalMeta>

              <ModalPrice>
                <ModalPriceLabel>Unit Price</ModalPriceLabel>
                <ModalPriceValue>₹{selectedProduct.unitPrice} per {selectedProduct.unit}</ModalPriceValue>
              </ModalPrice>

              <PlatformComparison>
                <ComparisonTitle>💰 Platform Price Comparison</ComparisonTitle>
                {selectedProduct.platforms.map(platform => (
                  <PlatformRow key={platform.platform}>
                    <PlatformRowName>{platform.platform}</PlatformRowName>
                    <PlatformRowPrice>₹{platform.price}</PlatformRowPrice>
                    <PlatformRowStatus available={platform.available}>
                      {platform.available ? `✅ ${platform.deliveryTime}` : '❌ Unavailable'}
                    </PlatformRowStatus>
                  </PlatformRow>
                ))}
              </PlatformComparison>

              <SavingsCalculation>
                <SavingsTitle>💸 Your Savings</SavingsTitle>
                <SavingsAmount>
                  Save ₹{Math.max(...selectedProduct.platforms.map(p => p.price)) - Math.min(...selectedProduct.platforms.map(p => p.price))}
                </SavingsAmount>
                <SavingsPercentage>
                  ({Math.round((1 - Math.min(...selectedProduct.platforms.map(p => p.price)) / Math.max(...selectedProduct.platforms.map(p => p.price))) * 100)}%)
                </SavingsPercentage>
              </SavingsCalculation>
            </ModalContent>
          </ProductModal>
        )}
      </SearchContentArea>
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
