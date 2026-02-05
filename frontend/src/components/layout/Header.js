import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../theme';
import Button from '../common/Button';
import Input from '../common/Input';

const HeaderContainer = styled(motion.header)`
  background-color: ${theme.colors.white};
  box-shadow: ${theme.shadows.base};
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.sticky};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    gap: ${theme.spacing[4]};
  }
`;

const Logo = styled(motion.div)`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${theme.colors.primary[600]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.primary[700]};
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
  position: relative;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[2]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[600]};
  transition: all ${theme.transitions.base};
  position: relative;
  
  &:hover {
    background-color: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[800]};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${theme.colors.error};
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.full};
  min-width: 16px;
  text-align: center;
`;

const Header = ({ 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit,
  cartItems = 0,
  onCartClick,
  onMenuToggle,
  isMenuOpen 
}) => {
  return (
    <HeaderContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <HeaderContent>
        {/* Logo */}
        <Logo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🛒
          <span>GroceryCompare</span>
        </Logo>

        {/* Search Bar */}
        <SearchContainer>
          <Input
            placeholder="Search for products, brands, categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
            size="md"
          />
        </SearchContainer>

        {/* Navigation Items */}
        <NavItems>
          {/* Theme Toggle */}
          <IconButton
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => console.log('Toggle theme')}
            title="Toggle dark mode"
          >
            🌙
          </IconButton>

          {/* Notifications */}
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => console.log('Notifications')}
            title="Notifications"
          >
            🔔
          </IconButton>

          {/* Cart */}
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCartClick}
            title="Shopping cart"
          >
            🛒
            {cartItems > 0 && <Badge>{cartItems}</Badge>}
          </IconButton>

          {/* User Account */}
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => console.log('User account')}
            title="User account"
          >
            👤
          </IconButton>

          {/* Mobile Menu Toggle */}
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuToggle}
            title="Menu"
            style={{ display: 'none' }}
            className="mobile-menu-toggle"
          >
            {isMenuOpen ? '✕' : '☰'}
          </IconButton>
        </NavItems>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
