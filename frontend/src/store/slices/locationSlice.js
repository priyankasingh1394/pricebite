import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import locationService from '../../services/locationService';

// Async thunks
export const getCurrentLocation = createAsyncThunk(
  'location/getCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const position = await locationService.getCurrentPosition();
      const address = await locationService.reverseGeocode(position.coords);
      return address;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchLocation = createAsyncThunk(
  'location/search',
  async (query, { rejectWithValue }) => {
    try {
      const results = await locationService.searchAddress(query);
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setLocation = createAsyncThunk(
  'location/set',
  async (locationData, { rejectWithValue }) => {
    try {
      await locationService.saveLocation(locationData);
      return locationData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentLocation: null,
  searchedLocations: [],
  isLoading: false,
  error: null,
  permissionGranted: false
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPermission: (state, action) => {
      state.permissionGranted = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchedLocations = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get current location
      .addCase(getCurrentLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLocation = action.payload;
      })
      .addCase(getCurrentLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search location
      .addCase(searchLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchedLocations = action.payload;
      })
      .addCase(searchLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Set location
      .addCase(setLocation.fulfilled, (state, action) => {
        state.currentLocation = action.payload;
      });
  }
});

export const { clearError, setPermission, clearSearchResults } = locationSlice.actions;
export default locationSlice.reducer;
