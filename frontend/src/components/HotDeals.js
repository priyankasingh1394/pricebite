import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HotDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/hot-deals')
      .then(res => res.json())
      .then(data => {
        setDeals(data.deals);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching hot deals:', err);
        setLoading(false);
      });
  }, []);

  const handleProductClick = (product) => {
    // Navigate to product details or search
    window.location.href = `/products?q=${encodeURIComponent(product.name)}`;
  };

  const formatSavings = (product) => {
    if (product.savingsPercentage > 50) {
      return { text: 'Massive Savings!', color: '#dc2626' };
    } else if (product.savingsPercentage > 30) {
      return { text: 'Great Deal!', color: '#f59e0b' };
    } else if (product.savingsPercentage > 15) {
      return { text: 'Good Savings', color: '#10b981' };
    } else {
      return { text: 'Save More', color: '#3b82f6' };
    }
  };

  if (loading) {
    return (
      <DealsContainer>
        <DealsHeader>
          <DealsIcon>🔥</DealsIcon>
          Hot Deals
        </DealsHeader>
        <LoadingMessage>
          <LoadingSpinner />
          Finding the best deals for you...
        </LoadingMessage>
      </DealsContainer>
    );
  }

  return (
    <DealsContainer>
      <DealsHeader>
        <DealsIcon>🔥</DealsIcon>
        Hot Deals
        <DealCount>{deals.length} deals</DealCount>
      </DealsHeader>
      
      <DealsGrid>
        {deals.map((deal, index) => {
          const savingsInfo = formatSavings(deal);
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <DealCard onClick={() => handleProductClick(deal)}>
                <DealHeader>
                  <ProductInfo>
                    <ProductImage>
                      {deal.category === 'Electronics' && '📱'}
                      {deal.category === 'Fashion' && '👕'}
                      {deal.category === 'Home & Kitchen' && '🏠'}
                      {deal.category === 'Beauty & Personal Care' && '💄'}
                      {deal.category === 'Grocery' && '🛒'}
                      {deal.category === 'Sports & Fitness' && '⚽'}
                      {deal.category === 'Books & Stationery' && '📚'}
                      {deal.category === 'Toys & Games' && '🎮'}
                    </ProductImage>
                    <ProductDetails>
                      <ProductName>{deal.name}</ProductName>
                      <ProductBrand>{deal.brand}</ProductBrand>
                      <ProductPackage>{deal.packageSize}</ProductPackage>
                    </ProductDetails>
                  </ProductInfo>
                  
                  <SavingsBadge color={savingsInfo.color}>
                    {savingsInfo.text}
                  </SavingsBadge>
                </DealHeader>
                
                <PriceComparison>
                  <BestPrice>
                    <PriceLabel>Best Price</PriceLabel>
                    <PriceAmount>₹{deal.minPrice}</PriceAmount>
                    <Platform>{deal.bestPlatform.platform}</Platform>
                  </BestPrice>
                  
                  <SavingsInfo>
                    <OriginalPrice>₹{deal.maxPrice}</OriginalPrice>
                    <SavingsAmount>
                      Save ₹{deal.savings}
                      <SavingsPercentage>({deal.savingsPercentage}% OFF)</SavingsPercentage>
                    </SavingsAmount>
                  </SavingsInfo>
                </PriceComparison>
                
                <PlatformsList>
                  {deal.platforms.map(platform => (
                    <PlatformItem
                      key={platform.platform}
                      isBest={platform.price === deal.minPrice}
                    >
                      <PlatformName>{platform.platform}</PlatformName>
                      <PlatformPrice>₹{platform.price}</PlatformPrice>
                      <PlatformDelivery>{platform.deliveryTime}</PlatformDelivery>
                    </PlatformItem>
                  ))}
                </PlatformsList>
              </DealCard>
            </motion.div>
          );
        })}
      </DealsGrid>
    </DealsContainer>
  );
};

const DealsContainer = styled.div`
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const DealsHeader = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DealsIcon = styled.span`
  font-size: 28px;
`;

const DealCount = styled.span`
  font-size: 14px;
  color: #64748b;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-size: 16px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DealsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`;

const DealCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`;

const DealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProductImage = styled.div`
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const ProductBrand = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 2px;
`;

const ProductPackage = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

const SavingsBadge = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

const PriceComparison = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BestPrice = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
`;

const PriceLabel = styled.div`
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 4px;
`;

const PriceAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const Platform = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const SavingsInfo = styled.div`
  text-align: center;
`;

const OriginalPrice = styled.div`
  font-size: 16px;
  color: #64748b;
  text-decoration: line-through;
  margin-bottom: 4px;
`;

const SavingsAmount = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
`;

const SavingsPercentage = styled.span`
  font-size: 14px;
  color: #047857;
  font-weight: 500;
`;

const PlatformsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PlatformItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.isBest ? '#f0fdf4' : '#f9fafb'};
  border: 1px solid ${props => props.isBest ? '#10b981' : '#e5e7eb'};
`;

const PlatformName = styled.div`
  font-weight: 500;
  color: ${props => props.isBest ? '#059669' : '#374151'};
`;

const PlatformPrice = styled.div`
  font-weight: 600;
  color: ${props => props.isBest ? '#059669' : '#2c3e50'};
`;

const PlatformDelivery = styled.div`
  font-size: 12px;
  color: #64748b;
`;

export default HotDeals;
