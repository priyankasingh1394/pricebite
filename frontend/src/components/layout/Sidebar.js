import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../theme';
import Button from '../common/Button';

const SidebarOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${theme.zIndex.modal};
  display: flex;
`;

const SidebarContainer = styled(motion.aside)`
  background-color: ${theme.colors.white};
  width: 300px;
  height: 100vh;
  box-shadow: ${theme.shadows.xl};
  overflow-y: auto;
  z-index: ${theme.zIndex.modal};
  
  @media (min-width: ${theme.breakpoints.lg}) {
    position: sticky;
    top: 80px;
    height: calc(100vh - 80px);
    box-shadow: none;
    border-right: 1px solid ${theme.colors.neutral[200]};
  }
`;

const SidebarHeader = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[800]};
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.neutral[600]};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transitions.base};
  
  &:hover {
    background-color: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[800]};
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const SidebarContent = styled.div`
  padding: ${theme.spacing[6]};
`;

const FilterSection = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const FilterTitle = styled.h4`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[3]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const CategoryItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[700]};
  
  &:hover {
    background-color: ${theme.colors.primary[50]};
    color: ${theme.colors.primary[700]};
  }
  
  ${props => props.active && `
    background-color: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};
    font-weight: ${theme.typography.fontWeight.semibold};
  `}
`;

const PriceRange = styled.div`
  margin-top: ${theme.spacing[3]};
`;

const RangeInput = styled.input`
  width: 100%;
  margin: ${theme.spacing[2]} 0;
  accent-color: ${theme.colors.primary[500]};
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.neutral[600]};
  margin-top: ${theme.spacing[1]};
`;

const BrandList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  max-height: 200px;
  overflow-y: auto;
`;

const BrandItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.base};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  font-size: ${theme.typography.fontSize.sm};
  
  &:hover {
    background-color: ${theme.colors.neutral[50]};
  }
`;

const Checkbox = styled.input`
  accent-color: ${theme.colors.primary[500]};
`;

const Sidebar = ({ 
  isOpen, 
  onClose, 
  categories = [], 
  selectedCategory,
  onCategoryChange,
  brands = [],
  selectedBrands,
  onBrandChange,
  priceRange,
  onPriceRangeChange 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SidebarOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ display: window.innerWidth >= 1024 ? 'none' : 'flex' }}
          />
          <SidebarContainer
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarHeader>
              <SidebarTitle>Filters</SidebarTitle>
              <CloseButton
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>
            </SidebarHeader>

            <SidebarContent>
              {/* Categories */}
              <FilterSection>
                <FilterTitle>
                  📂 Categories
                </FilterTitle>
                <CategoryList>
                  {categories.map(category => (
                    <CategoryItem
                      key={category}
                      active={selectedCategory === category}
                      onClick={() => onCategoryChange(category)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{getCategoryIcon(category)}</span>
                      {category}
                    </CategoryItem>
                  ))}
                </CategoryList>
              </FilterSection>

              {/* Price Range */}
              <FilterSection>
                <FilterTitle>
                  💰 Price Range
                </FilterTitle>
                <PriceRange>
                  <RangeLabels>
                    <span>Min: ₹{priceRange.min}</span>
                    <span>Max: ₹{priceRange.max}</span>
                  </RangeLabels>
                  <RangeInput
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.max}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) })}
                  />
                </PriceRange>
              </FilterSection>

              {/* Brands */}
              <FilterSection>
                <FilterTitle>
                  🏷️ Brands
                </FilterTitle>
                <BrandList>
                  {brands.map(brand => (
                    <BrandItem key={brand}>
                      <Checkbox
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onBrandChange([...selectedBrands, brand]);
                          } else {
                            onBrandChange(selectedBrands.filter(b => b !== brand));
                          }
                        }}
                      />
                      {brand}
                    </BrandItem>
                  ))}
                </BrandList>
              </FilterSection>

              {/* Clear Filters */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onCategoryChange('');
                  onBrandChange([]);
                  onPriceRangeChange({ min: 0, max: 500 });
                }}
                style={{ width: '100%' }}
              >
                Clear All Filters
              </Button>
            </SidebarContent>
          </SidebarContainer>
        </>
      )}
    </AnimatePresence>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    'Dairy': '🥛',
    'Vegetables': '🥬',
    'Fruits': '🍎',
    'Grains': '🌾',
    'Beverages': '🥤',
    'Packaged Foods': '📦'
  };
  return icons[category] || '📋';
};

export default Sidebar;
