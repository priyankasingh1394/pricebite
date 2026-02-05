import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Spinner Component
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing[4]};
`;

const Spinner = styled.div`
  width: ${props => props.size === 'sm' ? '24px' : props.size === 'lg' ? '48px' : '32px'};
  height: ${props => props.size === 'sm' ? '24px' : props.size === 'lg' ? '48px' : '32px'};
  border: 3px solid ${theme.colors.neutral[200]};
  border-top: 3px solid ${theme.colors.primary[500]};
  border-radius: ${theme.borderRadius.full};
  animation: ${spin} 1s linear infinite;
`;

// Skeleton Loader Component
const SkeletonContainer = styled.div`
  width: 100%;
`;

const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${theme.colors.neutral[200]} 25%,
    ${theme.colors.neutral[100]} 50%,
    ${theme.colors.neutral[200]} 75%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: ${theme.borderRadius.lg};
  
  ${props => props.height && `height: ${props.height};`}
  ${props => props.width && `width: ${props.width};`}
  ${props => props.margin && `margin: ${props.margin};`}
`;

// Loading Dots Component
const DotsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: center;
  justify-content: center;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.primary[500]};
`;

// Loading States
export const SpinnerLoader = ({ size = 'md', message }) => (
  <SpinnerContainer>
    <div>
      <Spinner size={size} />
      {message && (
        <div style={{ 
          marginTop: theme.spacing[3], 
          textAlign: 'center',
          color: theme.colors.neutral[600],
          fontSize: theme.typography.fontSize.sm 
        }}>
          {message}
        </div>
      )}
    </div>
  </SpinnerContainer>
);

export const SkeletonLoader = ({ height = '20px', width = '100%', margin = '0' }) => (
  <SkeletonContainer>
    <Skeleton height={height} width={width} margin={margin} />
  </SkeletonContainer>
);

export const DotsLoader = ({ message }) => (
  <SpinnerContainer>
    <div>
      <DotsContainer>
        <Dot
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
        <Dot
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
        <Dot
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
        />
      </DotsContainer>
      {message && (
        <div style={{ 
          marginTop: theme.spacing[3], 
          textAlign: 'center',
          color: theme.colors.neutral[600],
          fontSize: theme.typography.fontSize.sm 
        }}>
          {message}
        </div>
      )}
    </div>
  </SpinnerContainer>
);

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      border: `1px solid ${theme.colors.neutral[200]}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[4],
      backgroundColor: theme.colors.white,
    }}
  >
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing[3] }}>
      <SkeletonLoader height="24px" width="150px" />
      <SkeletonLoader height="24px" width="80px" />
    </div>
    
    {/* Subtitle */}
    <SkeletonLoader height="16px" width="120px" margin={`0 0 ${theme.spacing[3]} 0`} />
    
    {/* Price Range */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing[3] }}>
      <SkeletonLoader height="20px" width="100px" />
      <SkeletonLoader height="20px" width="80px" />
    </div>
    
    {/* Platform Pills */}
    <div style={{ display: 'flex', gap: theme.spacing[2] }}>
      <SkeletonLoader height="24px" width="80px" />
      <SkeletonLoader height="24px" width="80px" />
      <SkeletonLoader height="24px" width="80px" />
    </div>
    
    {/* Nutritional Info */}
    <div style={{ marginTop: theme.spacing[3], paddingTop: theme.spacing[3], borderTop: `1px solid ${theme.colors.neutral[200]}` }}>
      <SkeletonLoader height="16px" width="200px" />
    </div>
  </motion.div>
);

export default {
  SpinnerLoader,
  SkeletonLoader,
  DotsLoader,
  ProductCardSkeleton,
};
