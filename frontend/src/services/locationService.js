// Location service for geolocation and address handling
const locationService = {
  // Get current position
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  },

  // Reverse geocoding (coordinates to address)
  reverseGeocode: async (coords) => {
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: data.display_name,
        city: data.address?.city || data.address?.town || '',
        state: data.address?.state || '',
        country: data.address?.country || '',
        postalCode: data.address?.postcode || ''
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  },

  // Search for addresses
  searchAddress: async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      
      return data.map(item => ({
        display_name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        city: item.address?.city || item.address?.town || '',
        state: item.address?.state || '',
        country: item.address?.country || ''
      }));
    } catch (error) {
      console.error('Address search error:', error);
      throw error;
    }
  },

  // Save location to local storage
  saveLocation: async (locationData) => {
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    return locationData;
  },

  // Get saved location
  getSavedLocation: () => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  },

  // Check geolocation permission
  checkPermission: () => {
    return new Promise((resolve) => {
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(resolve);
      } else {
        resolve('granted'); // Assume granted if permissions API not available
      }
    });
  },

  // Calculate distance between two points (in km)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
};

export default locationService;
