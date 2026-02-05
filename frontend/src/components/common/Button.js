import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../theme';

const StyledButton = styled(motion.button)`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      case 'xl': return theme.typography.fontSize.xl;
      default: return theme.typography.fontSize.base;
    }
  }};
  font-weight: ${theme.typography.fontWeight.semibold};
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${theme.spacing[2]} ${theme.spacing[4]}`;
      case 'lg': return `${theme.spacing[4]} ${theme.spacing[8]}`;
      case 'xl': return `${theme.spacing[5]} ${theme.spacing[10]}`;
      default: return `${theme.spacing[3]} ${theme.spacing[6]}`;
    }
  }};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  
  /* Variants */
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return theme.colors.primary[500];
      case 'secondary': return theme.colors.secondary[500];
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return theme.colors.primary[500];
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'primary': return theme.colors.white;
      case 'secondary': return theme.colors.white;
      case 'outline': return theme.colors.primary[500];
      case 'ghost': return theme.colors.primary[500];
      default: return theme.colors.white;
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'outline': return `2px solid ${theme.colors.primary[500]}`;
      case 'ghost': return `2px solid ${theme.colors.primary[500]}`;
      default: return 'none';
    }
  }};
  
  /* States */
  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return theme.colors.primary[600];
        case 'secondary': return theme.colors.secondary[600];
        case 'outline': return theme.colors.primary[50];
        case 'ghost': return theme.colors.primary[50];
        default: return theme.colors.primary[600];
      }
    }};
    
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${theme.shadows.sm};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  /* Loading state */
  ${props => props.loading && `
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid ${props.variant === 'outline' || props.variant === 'ghost' ? theme.colors.primary[500] : theme.colors.white};
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
    }
  `}
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon,
  onClick,
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};

export default Button;
