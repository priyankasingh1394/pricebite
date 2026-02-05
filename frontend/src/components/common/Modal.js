import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../theme';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing[4]};
`;

const ModalContent = styled(motion.div)`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.xl};
  max-width: ${props => props.maxWidth || '600px'};
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
  background-color: ${theme.colors.neutral[100]};
  border: none;
  border-radius: ${theme.borderRadius.full};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.neutral[600]};
  transition: all ${theme.transitions.base};
  
  &:hover {
    background-color: ${theme.colors.neutral[200]};
    color: ${theme.colors.neutral[800]};
  }
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[800]};
  margin: 0;
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth,
  ...props 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <ModalContent
            maxWidth={maxWidth}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              <CloseButton
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {children}
            </ModalBody>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
