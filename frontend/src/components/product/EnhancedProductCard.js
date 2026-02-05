import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../theme';
import Button from '../common/Button';

const CardContainer = styled(motion.div)`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-4px);
    border-color: ${theme.colors.primary[300]};
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.neutral[100]};
  position: relative;
  overflow: hidden;
  margin-bottom: ${theme.spacing[4]};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${theme.transitions.slow};
  
  ${CardContainer}:hover & {
    transform: scale(1.1);
  }
`;

const QuickActions = styled.div`
  position: absolute;
  top: ${theme.spacing[3]};
  right: ${theme.spacing[3]};
  display: flex;
  gap: ${theme.spacing[2]};
  opacity: 0;
  transition: opacity ${theme.transitions.base};
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const QuickActionButton = styled(motion.button)`
  background-color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.full};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.shadows.md};
  transition: all ${theme.transitions.base};
  
  &:hover {
    background-color: ${theme.colors.primary[500]};
    color: ${theme.colors.white};
  }
`;

const ProductInfo = styled.div`
  margin-bottom: ${theme.spacing[3]};
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[2]};
`;

const ProductName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[800]};
  margin: 0;
  line-height: ${theme.typography.lineHeight.tight};
`;

const CategoryBadge = styled.span`
  background-color: ${theme.colors.primary[100]};
  color: ${theme.colors.primary[700]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const BrandName = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[2]};
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
`;

const PriceRange = styled.div`
  text-align: left;
`;

const PriceLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[1]};
`;

const PriceValue = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.neutral[800]};
`;

const BestPrice = styled.div`
  text-align: right;
`;

const BestPriceLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.secondary[600]};
  margin-bottom: ${theme.spacing[1]};
`;

const BestPriceValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${theme.colors.secondary[600]};
`;

const PlatformPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const PlatformPill = styled.div`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  
  ${props => props.available ? `
    background-color: ${theme.colors.success[100]};
    color: ${theme.colors.success[700]};
  ` : `
    background-color: ${theme.colors.error[100]};
    color: ${theme.colors.error[700]};
  `}
`;

const DeliveryTime = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  opacity: 0.8;
`;

const NutritionalInfo = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  padding-top: ${theme.spacing[3]};
  border-top: 1px solid ${theme.colors.neutral[200]};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.neutral[600]};
`;

const Nutrient = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const BestDealBadge = styled.div`
  position: absolute;
  top: ${theme.spacing[3]};
  left: ${theme.spacing[3]};
  background-color: ${theme.colors.secondary[500]};
  color: ${theme.colors.white};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  box-shadow: ${theme.shadows.md};
`;

const EnhancedProductCard = ({ product, onCompare, onWishlist, onQuickView }) => {
  const cheapestPrice = Math.min(...product.platforms.map(p => p.price));
  const cheapestPlatform = product.platforms.find(p => p.price === cheapestPrice);
  const savings = Math.max(...product.platforms.map(p => p.price)) - cheapestPrice;

  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ y: -4 }}
    >
      {/* Best Deal Badge */}
      {cheapestPlatform && (
        <BestDealBadge>
          🏆 BEST DEAL
        </BestDealBadge>
      )}

      {/* Quick Actions */}
      <QuickActions>
        <QuickActionButton
          onClick={() => onWishlist(product)}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          title="Add to wishlist"
        >
          ❤️
        </QuickActionButton>
        <QuickActionButton
          onClick={() => onCompare(product)}
          whileHover={{ scale: 1.1, rotate: -15 }}
          whileTap={{ scale: 0.9 }}
          title="Compare"
        >
          ⚖️
        </QuickActionButton>
        <QuickActionButton
          onClick={() => onQuickView(product)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Quick view"
        >
          👁️
        </QuickActionButton>
      </QuickActions>

      {/* Product Image */}
      <ProductImage>
        <Image 
          src={product.image || '/api/placeholder/300/200'}
          alt={product.name}
        />
      </ProductImage>

      {/* Product Information */}
      <ProductInfo>
        <ProductHeader>
          <ProductName>{product.name}</ProductName>
          <CategoryBadge>{product.category}</CategoryBadge>
        </ProductHeader>
        
        <BrandName>{product.brand}</BrandName>

        {/* Price Information */}
        <PriceSection>
          <PriceRange>
            <PriceLabel>Price Range</PriceLabel>
            <PriceValue>
              ₹{Math.min(...product.platforms.map(p => p.price))} - ₹{Math.max(...product.platforms.map(p => p.price))}
            </PriceValue>
          </PriceRange>
          
          <BestPrice>
            <BestPriceLabel>Best Price</BestPriceLabel>
            <BestPriceValue>₹{cheapestPrice}</BestPriceValue>
          </BestPrice>
        </PriceSection>

        {/* Platform Availability */}
        <PlatformPills>
          {product.platforms.map(platform => (
            <PlatformPill key={platform.platform} available={platform.available}>
              <span>{platform.available ? '✓' : '✗'}</span>
              {platform.platform}: ₹{platform.price}
              <DeliveryTime> • {platform.deliveryTime}</DeliveryTime>
            </PlatformPill>
          ))}
        </PlatformPills>

        {/* Nutritional Information */}
        <NutritionalInfo>
          <Nutrient>
            🔥 {product.nutritionalInfo.calories} cal
          </Nutrient>
          <Nutrient>
            🥩 {product.nutritionalInfo.protein}g protein
          </Nutrient>
          <Nutrient>
            🧈 {product.nutritionalInfo.fat}g fat
          </Nutrient>
          <Nutrient>
            🌾 {product.nutritionalInfo.carbs}g carbs
          </Nutrient>
        </NutritionalInfo>
      </ProductInfo>

      {/* Savings Information */}
      {savings > 0 && (
        <div style={{
          position: 'absolute',
          bottom: theme.spacing[3],
          right: theme.spacing[3],
          backgroundColor: theme.colors.secondary[100],
          color: theme.colors.secondary[700],
          padding: theme.spacing[2],
          borderRadius: theme.borderRadius.lg,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold
        }}>
          💰 Save ₹{savings}
        </div>
      )}
    </CardContainer>
  );
};

export default EnhancedProductCard;
