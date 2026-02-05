import React from 'react';

const ProductCard = ({ product, onProductClick }) => {
  const cheapestPrice = Math.min(...product.platforms.map(p => p.price));
  const cheapestPlatform = product.platforms.find(p => p.price === cheapestPrice);
  
  return (
    <div 
      onClick={() => onProductClick(product)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {/* Product Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            {product.name}
          </h3>
          <p style={{ 
            margin: '0', 
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            {product.brand} • {product.packageSize}
          </p>
        </div>
        <div style={{
          backgroundColor: '#e8f4f8',
          color: '#2980b9',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {product.category}
        </div>
      </div>

      {/* Price Range */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div>
          <span style={{ color: '#7f8c8d', fontSize: '12px' }}>Price Range:</span>
          <div style={{ 
            fontWeight: 'bold', 
            color: '#2c3e50',
            fontSize: '16px'
          }}>
            ₹{Math.min(...product.platforms.map(p => p.price))} - ₹{Math.max(...product.platforms.map(p => p.price))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: '#27ae60', fontSize: '12px' }}>Best Price:</span>
          <div style={{ 
            fontWeight: 'bold', 
            color: '#27ae60',
            fontSize: '16px'
          }}>
            ₹{cheapestPrice}
          </div>
        </div>
      </div>

      {/* Platform Availability */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap',
        marginBottom: '12px'
      }}>
        {product.platforms.map(platform => (
          <div
            key={platform.platform}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              backgroundColor: platform.available ? '#d4edda' : '#f8d7da',
              color: platform.available ? '#155724' : '#721c24',
              border: platform.available ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
            }}
          >
            {platform.platform}: ₹{platform.price}
            {!platform.available && ' (Out of Stock)'}
          </div>
        ))}
      </div>

      {/* Nutritional Info */}
      <div style={{ 
        fontSize: '12px', 
        color: '#7f8c8d',
        borderTop: '1px solid #eee',
        paddingTop: '8px'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>🔥 {product.nutritionalInfo.calories} cal</span>
          <span>🥩 {product.nutritionalInfo.protein}g protein</span>
          <span>🧈 {product.nutritionalInfo.fat}g fat</span>
          <span>🌾 {product.nutritionalInfo.carbs}g carbs</span>
        </div>
      </div>

      {/* Best Deal Badge */}
      {cheapestPlatform && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          BEST DEAL: {cheapestPlatform.platform}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
