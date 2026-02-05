import React, { useState } from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
`;

const ContactCard = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 32px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  margin-bottom: 20px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-bottom: 20px;
  text-align: center;
`;

const ContactInfo = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
`;

const ContactItem = styled.div`
  margin-bottom: 15px;
  color: #666;
  
  strong {
    color: #2c3e50;
    display: block;
    margin-bottom: 5px;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    return formData.name.trim() && 
           formData.email.trim() && 
           formData.message.trim() &&
           formData.email.includes('@');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
      
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      <ContactCard>
        <Title>📞 Contact PriceBite</Title>
        <Subtitle>We're here to help! Get in touch with our support team.</Subtitle>
        
        {submitStatus === 'success' && (
          <SuccessMessage>
            ✅ Thank you for contacting us! We'll get back to you within 24 hours.
          </SuccessMessage>
        )}
        
        {submitStatus === 'error' && (
          <ErrorMessage>
            ❌ Please fill in all required fields correctly.
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name *</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email Address *</Label>
            <Input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Category</Label>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="general">General Inquiry</option>
              <option value="technical">Technical Support</option>
              <option value="billing">Billing Issue</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
              <option value="partnership">Partnership</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Subject</Label>
            <Input
              type="text"
              name="subject"
              placeholder="Brief description of your inquiry"
              value={formData.subject}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Message *</Label>
            <TextArea
              name="message"
              placeholder="Please describe your issue or question in detail..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </Form>

        <ContactInfo>
          <ContactItem>
            <strong>📧 Email Support</strong>
            support@pricebite.com
          </ContactItem>
          <ContactItem>
            <strong>📱 Phone Support</strong>
            +91 1800-PRICE-BITE (1800-77423-2483)
          </ContactItem>
          <ContactItem>
            <strong>💬 Live Chat</strong>
            Available Monday - Friday, 9 AM - 6 PM IST
          </ContactItem>
          <ContactItem>
            <strong>📍 Office Address</strong>
            PriceBite HQ, Bangalore, Karnataka 560001, India
          </ContactItem>
        </ContactInfo>
      </ContactCard>
    </ContactContainer>
  );
};

export default Contact;
