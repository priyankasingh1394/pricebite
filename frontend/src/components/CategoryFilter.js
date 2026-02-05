import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const categoryIcons = {
    'Dairy': '🥛',
    'Vegetables': '🥬',
    'Fruits': '🍎',
    'Grains': '🌾',
    'Beverages': '🥤',
    'Packaged Foods': '📦'
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: 'bold',
        color: '#2c3e50'
      }}>
        Category:
      </label>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '8px' 
      }}>
        <button
          key="all"
          onClick={() => onCategoryChange('')}
          style={{
            padding: '8px 16px',
            border: '2px solid #ddd',
            borderRadius: '20px',
            backgroundColor: !selectedCategory ? '#3498db' : 'white',
            color: !selectedCategory ? 'white' : '#2c3e50',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            style={{
              padding: '8px 16px',
              border: '2px solid #ddd',
              borderRadius: '20px',
              backgroundColor: selectedCategory === category ? '#3498db' : 'white',
              color: selectedCategory === category ? 'white' : '#2c3e50',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{categoryIcons[category] || '📋'}</span>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
