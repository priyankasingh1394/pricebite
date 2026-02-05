import { useState, useEffect } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch product suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('http://localhost:5001/products/list');
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    setShowSuggestions(false);

    if (!query.trim()) {
      setError('Please type a product name.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/products?name=${encodeURIComponent(query.trim())}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.length === 0) {
        setError(`No results found for "${query}". Try: ${suggestions.slice(0, 3).join(', ')}`);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Could not reach the backend. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const cheapestPrice = results.length
    ? Math.min(...results.map((item) => item.price))
    : null;

  const filteredSuggestions = query
    ? suggestions.filter(product => 
        product.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#2c3e50',
        marginBottom: '32px'
      }}>
        Grocery Price Compare
      </h2>

      <form onSubmit={handleSearch} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Type a product (e.g., Milk, Eggs, Rice)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px 24px',
              backgroundColor: loading ? '#ccc' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#f8f9fa'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>

      {error && (
        <p style={{ 
          color: '#e74c3c', 
          backgroundColor: '#fdf2f2',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </p>
      )}

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666'
        }}>
          Loading price comparisons...
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ 
            marginBottom: '16px',
            color: '#2c3e50'
          }}>
            Price Comparison for "{query}"
          </h3>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ 
                  border: 'none', 
                  padding: '16px',
                  textAlign: 'left'
                }}>Platform</th>
                <th style={{ 
                  border: 'none', 
                  padding: '16px',
                  textAlign: 'right'
                }}>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr
                  key={item.platform}
                  style={{
                    backgroundColor: item.price === cheapestPrice ? '#d4edda' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <td style={{ 
                    border: 'none', 
                    padding: '16px',
                    fontWeight: item.price === cheapestPrice ? 'bold' : 'normal'
                  }}>
                    {item.platform}
                    {item.price === cheapestPrice && (
                      <span style={{ 
                        marginLeft: '8px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        Best Price
                      </span>
                    )}
                  </td>
                  <td style={{ 
                    border: 'none', 
                    padding: '16px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: item.price === cheapestPrice ? '#28a745' : '#2c3e50'
                  }}>
                    {item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {cheapestPrice && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#e8f5e8',
              borderRadius: '8px',
              border: '1px solid #c3e6cb'
            }}>
              <strong>You save ₹{Math.max(...results.map(r => r.price)) - cheapestPrice} by choosing the cheapest option!</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
