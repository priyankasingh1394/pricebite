import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
`;

const AboutCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 36px;
  font-weight: bold;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #667eea;
  margin-bottom: 20px;
  font-size: 24px;
`;

const Text = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 16px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 30px 0;
`;

const FeatureCard = styled.div`
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  border: 2px solid #e9ecef;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 18px;
`;

const FeatureDescription = styled.p`
  color: #666;
  font-size: 14px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const About = () => {
  return (
    <AboutContainer>
      <AboutCard>
        <Title>🛒 About PriceBite</Title>
        
        <Section>
          <Text>
            <strong>PriceBite</strong> is your smart grocery shopping companion that helps you find the best deals across multiple delivery platforms. We compare prices from Zepto, Blinkit, and Instamart to ensure you never overpay for your groceries.
          </Text>
          <Text>
            Founded in 2024, we're on a mission to make grocery shopping more affordable and transparent for everyone. Our advanced algorithms scan multiple platforms in real-time to bring you the most accurate price comparisons.
          </Text>
        </Section>

        <Section>
          <SectionTitle>🚀 What We Offer</SectionTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>💰</FeatureIcon>
              <FeatureTitle>Real-time Price Comparison</FeatureTitle>
              <FeatureDescription>
                Compare prices across multiple platforms instantly
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>📍</FeatureIcon>
              <FeatureTitle>Location-based Pricing</FeatureTitle>
              <FeatureDescription>
                Get accurate prices for your specific area
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🥗</FeatureIcon>
              <FeatureTitle>Nutritional Information</FeatureTitle>
              <FeatureDescription>
                Make informed choices with detailed nutrition data
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>🔔</FeatureIcon>
              <FeatureTitle>Price Alerts</FeatureTitle>
              <FeatureDescription>
                Get notified when prices drop on your favorite items
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </Section>

        <Section>
          <SectionTitle>📊 Our Impact</SectionTitle>
          <StatsContainer>
            <StatCard>
              <StatNumber>50K+</StatNumber>
              <StatLabel>Happy Users</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>₹2Cr+</StatNumber>
              <StatLabel>Savings Generated</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>1000+</StatNumber>
              <StatLabel>Products Compared</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>3</StatNumber>
              <StatLabel>Platform Partners</StatLabel>
            </StatCard>
          </StatsContainer>
        </Section>

        <Section>
          <SectionTitle>🎯 Our Mission</SectionTitle>
          <Text>
            We believe everyone deserves access to fair grocery prices. By bringing transparency to the market, we empower consumers to make smarter choices and save money on every purchase.
          </Text>
          <Text>
            <strong>Join us</strong> in revolutionizing grocery shopping in India. Together, we can create a more affordable and transparent food ecosystem for all.
          </Text>
        </Section>
      </AboutCard>
    </AboutContainer>
  );
};

export default About;
