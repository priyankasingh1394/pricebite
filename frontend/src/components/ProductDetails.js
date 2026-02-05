import React from 'react';

const ProductDetails = ({ product, onClose }) => {
  const cheapestPrice = Math.min(...product.platforms.map(p => p.price));
  const cheapestPlatform = product.platforms.find(p => p.price === cheapestPrice);
  const savings = Math.max(...product.platforms.map(p => p.price)) - cheapestPrice;

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
              {product.name}
            </h2>
            <p style={{ margin: '0', color: '#7f8c8d' }}>
              {product.brand} • {product.packageSize}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#7f8c8d',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Nutritional Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50' }}>
              Nutritional Information
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔥</div>
                <div style={{ fontWeight: 'bold' }}>{product.nutritionalInfo.calories}</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Calories</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🥩</div>
                <div style={{ fontWeight: 'bold' }}>{product.nutritionalInfo.protein}g</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Protein</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🧈</div>
                <div style={{ fontWeight: 'bold' }}>{product.nutritionalInfo.fat}g</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Fat</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>🌾</div>
                <div style={{ fontWeight: 'bold' }}>{product.nutritionalInfo.carbs}g</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Carbs</div>
              </div>
            </div>
          </div>

          {/* Price Comparison */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50' }}>
              Price Comparison
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {product.platforms.map(platform => (
                <div
                  key={platform.platform}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: platform.price === cheapestPrice ? '#d4edda' : 'white'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {platform.platform}
                    </div>
                    <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                      {platform.available ? 
                        `🟢 Available • ${platform.deliveryTime}` : 
                        '🔴 Out of Stock'
                      }
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      fontSize: '20px',
                      color: platform.price === cheapestPrice ? '#27ae60' : '#2c3e50'
                    }}>
                      ₹{platform.price}
                    </div>
                    {platform.price === cheapestPrice && (
                      <div style={{ 
                        backgroundColor: '#27ae60', 
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        BEST PRICE
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Summary */}
          {savings > 0 && (
            <div style={{
              backgroundColor: '#e8f5e8',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#27ae60' }}>
                💰 You Save ₹{savings}!
              </h3>
              <p style={{ margin: '0', color: '#27ae60' }}>
                Choose {cheapestPlatform.platform} for the best deal on {product.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
