import React from 'react';

const BrandFilter = ({ brands, selectedBrand, onBrandChange }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: 'bold',
        color: '#2c3e50'
      }}>
        Brand:
      </label>
      <select
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: 'white',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        <option value="">All Brands</option>
        {brands.map(brand => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BrandFilter;
