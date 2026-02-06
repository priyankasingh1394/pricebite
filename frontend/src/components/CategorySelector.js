import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CategorySelector = ({ selectedCategory, selectedSubcategory, onCategoryChange, onSubcategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    // Fetch categories from backend
    fetch('http://localhost:5001/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        // Auto-expand first category
        if (data.length > 0) {
          setExpandedCategories(prev => ({ ...prev, [data[0].category]: true }));
        }
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Fetch subcategories for selected category
      const categoryData = categories.find(cat => cat.category === selectedCategory);
      if (categoryData && categoryData.subcategories) {
        setSubcategories(categoryData.subcategories);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories]);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    } else {
      onCategoryChange(category);
      onSubcategoryChange('');
      setExpandedCategories(prev => ({ ...prev, [category]: true }));
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    onSubcategoryChange(subcategory);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Grocery': '🛒',
      'Electronics': '📱',
      'Fashion': '👕',
      'Home & Kitchen': '🏠',
      'Beauty & Personal Care': '💄',
      'Sports & Fitness': '⚽',
      'Books & Stationery': '📚',
      'Toys & Games': '🎮'
    };
    return icons[category] || '📦';
  };

  return (
    <CategoryContainer>
      <CategoryTitle>
        <CategoryIcon>🏷️</CategoryIcon>
        Shop by Category
      </CategoryTitle>
      
      <CategoryGrid>
        {categories.map((categoryData, index) => (
          <motion.div
            key={categoryData.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CategoryCard
              onClick={() => handleCategoryClick(categoryData.category)}
              isSelected={selectedCategory === categoryData.category}
            >
              <CategoryHeader>
                <CategoryIconLarge>
                  {getCategoryIcon(categoryData.category)}
                </CategoryIconLarge>
                <CategoryName>{categoryData.category}</CategoryName>
                <CategoryCount>
                  {categoryData.subcategories.length} subcategories
                </CategoryCount>
                <ExpandIcon>
                  {expandedCategories[categoryData.category] ? '−' : '+'}
                </ExpandIcon>
              </CategoryHeader>
              
              {expandedCategories[categoryData.category] && categoryData.subcategories.length > 0 && (
                <SubcategoryList>
                  {categoryData.subcategories.map(subcategory => (
                    <SubcategoryItem
                      key={subcategory}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      isSelected={selectedSubcategory === subcategory}
                    >
                      {subcategory}
                    </SubcategoryItem>
                  ))}
                </SubcategoryList>
              )}
            </CategoryCard>
          </motion.div>
        ))}
      </CategoryGrid>
    </CategoryContainer>
  );
};

const CategoryContainer = styled.div`
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const CategoryTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryIcon = styled.span`
  font-size: 24px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;

const CategoryCard = styled.div`
  background: ${props => props.isSelected ? '#f0f9ff' : '#f8fafc'};
  border: 2px solid ${props => props.isSelected ? '#0ea5e9' : '#e2e8f0'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.isSelected ? '#e0f2fe' : '#f1f5f9'};
    border-color: ${props => props.isSelected ? '#0284c7' : '#d1d5db'};
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.showSubcategories ? '16px' : '0'};
`;

const CategoryIconLarge = styled.div`
  font-size: 32px;
  margin-right: 12px;
`;

const CategoryName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
`;

const CategoryCount = styled.div`
  font-size: 12px;
  color: #64748b;
  background: #e2e8f0;
  padding: 4px 8px;
  border-radius: 12px;
`;

const ExpandIcon = styled.div`
  font-size: 18px;
  color: #64748b;
  font-weight: bold;
  margin-left: 8px;
`;

const SubcategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const SubcategoryItem = styled.div`
  background: ${props => props.isSelected ? '#dbeafe' : '#f1f5f9'};
  border: 1px solid ${props => props.isSelected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.isSelected ? '#1e40af' : '#374151'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isSelected ? '#3b82f6' : '#e5e7eb'};
    border-color: ${props => props.isSelected ? '#2563eb' : '#d1d5db'};
    transform: translateY(-1px);
  }
`;

export default CategorySelector;
