import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../theme';
import Button from '../common/Button';

const FooterContainer = styled(motion.footer)`
  background-color: ${theme.colors.neutral[900]};
  color: ${theme.colors.neutral[300]};
  padding: ${theme.spacing[12]} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${theme.spacing[6]};
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const FooterTitle = styled.h4`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[3]};
`;

const FooterLink = styled(motion.a)`
  color: ${theme.colors.neutral[400]};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.sm};
  transition: color ${theme.transitions.base};
  
  &:hover {
    color: ${theme.colors.primary[400]};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
`;

const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.neutral[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[400]};
  transition: all ${theme.transitions.base};
  
  &:hover {
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
  }
`;

const NewsletterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[3]};
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.neutral[700]};
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.neutral[800]};
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.sm};
  
  &::placeholder {
    color: ${theme.colors.neutral[500]};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
  }
`;

const Copyright = styled.div`
  border-top: 1px solid ${theme.colors.neutral[800]};
  padding-top: ${theme.spacing[6]};
  text-align: center;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[500]};
`;

const AppButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
`;

const Footer = () => {
  return (
    <FooterContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <FooterContent>
        <FooterGrid>
          {/* About Section */}
          <FooterSection>
            <FooterTitle>About GroceryCompare</FooterTitle>
            <FooterLink href="#about">About Us</FooterLink>
            <FooterLink href="#how-it-works">How It Works</FooterLink>
            <FooterLink href="#careers">Careers</FooterLink>
            <FooterLink href="#press">Press</FooterLink>
          </FooterSection>

          {/* Categories Section */}
          <FooterSection>
            <FooterTitle>Categories</FooterTitle>
            <FooterLink href="#dairy">Dairy Products</FooterLink>
            <FooterLink href="#vegetables">Fresh Vegetables</FooterLink>
            <FooterLink href="#fruits">Fruits</FooterLink>
            <FooterLink href="#grains">Grains & Staples</FooterLink>
            <FooterLink href="#beverages">Beverages</FooterLink>
          </FooterSection>

          {/* Support Section */}
          <FooterSection>
            <FooterTitle>Support</FooterTitle>
            <FooterLink href="#help">Help Center</FooterLink>
            <FooterLink href="#contact">Contact Us</FooterLink>
            <FooterLink href="#faq">FAQs</FooterLink>
            <FooterLink href="#returns">Returns & Refunds</FooterLink>
          </FooterSection>

          {/* Legal Section */}
          <FooterSection>
            <FooterTitle>Legal</FooterTitle>
            <FooterLink href="#terms">Terms of Service</FooterLink>
            <FooterLink href="#privacy">Privacy Policy</FooterLink>
            <FooterLink href="#cookies">Cookie Policy</FooterLink>
            <FooterLink href="#disclaimer">Disclaimer</FooterLink>
          </FooterSection>
        </FooterGrid>

        {/* Newsletter Section */}
        <NewsletterSection>
          <FooterTitle>Stay Updated</FooterTitle>
          <p style={{ color: theme.colors.neutral[400], fontSize: theme.typography.fontSize.sm }}>
            Get the latest deals and price updates delivered to your inbox
          </p>
          <NewsletterForm>
            <NewsletterInput 
              type="email" 
              placeholder="Enter your email"
              whileFocus={{ scale: 1.02 }}
            />
            <Button 
              type="submit"
              size="sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </Button>
          </NewsletterForm>
        </NewsletterSection>
      </FooterContent>

      {/* Bottom Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `0 ${theme.spacing[6]}` }}>
        {/* Social Links */}
        <SocialLinks>
          <SocialLink
            href="#facebook"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            f
          </SocialLink>
          <SocialLink
            href="#twitter"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            𝕏
          </SocialLink>
          <SocialLink
            href="#instagram"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            📷
          </SocialLink>
          <SocialLink
            href="#linkedin"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            in
          </SocialLink>
        </SocialLinks>

        {/* App Download Buttons */}
        <AppButtons>
          <Button 
            variant="outline" 
            size="sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📱 Download App
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⭐ Rate Us
          </Button>
        </AppButtons>
      </div>

      {/* Copyright */}
      <Copyright>
        <p>© 2024 GroceryCompare. All rights reserved.</p>
        <p>Made with ❤️ for smart shoppers in India</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
