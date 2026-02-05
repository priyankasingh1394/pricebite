import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../theme';

const StyledInput = styled(motion.input)`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.base;
    }
  }};
  font-weight: ${theme.typography.fontWeight.normal};
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${theme.spacing[2]} ${theme.spacing[3]}`;
      case 'lg': return `${theme.spacing[4]} ${theme.spacing[5]}`;
      default: return `${theme.spacing[3]} ${theme.spacing[4]}`;
    }
  }};
  border: 2px solid ${props => props.error ? theme.colors.error : theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.white};
  color: ${theme.colors.neutral[800]};
  transition: all ${theme.transitions.base};
  outline: none;
  width: 100%;
  
  &:focus {
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
  
  &:disabled {
    background-color: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[500]};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${theme.colors.neutral[500]};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[2]};
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.error};
  margin-top: ${theme.spacing[1]};
`;

const Input = ({ 
  label, 
  error, 
  icon, 
  size = 'md', 
  disabled = false,
  ...props 
}) => {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <StyledInput
        size={size}
        error={error}
        disabled={disabled}
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
