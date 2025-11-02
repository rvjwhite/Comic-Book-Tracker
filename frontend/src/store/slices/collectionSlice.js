import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = {
  collections: [],
  currentCollection: null,
  stats: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get auth headers
const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Get all collections
export const getCollections = createAsyncThunk(
  'collection/getAll',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/collections`,
        {
          ...getAuthHeaders(token),
          params,
        }
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new collection
export const createCollection = createAsyncThunk(
  'collection/create',
  async (collectionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/collections`,
        collectionData,
        getAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update collection
export const updateCollection = createAsyncThunk(
  'collection/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.put(
        `${API_URL}/collections/${id}`,
        data,
        getAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete collection
export const deleteCollection = createAsyncThunk(
  'collection/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await axios.delete(`${API_URL}/collections/${id}`, getAuthHeaders(token));
      return id;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get collection stats
export const getStats = createAsyncThunk(
  'collection/getStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/collections/stats/summary`,
        getAuthHeaders(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCollections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.collections = action.payload.collections;
      })
      .addCase(getCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.collections.push(action.payload.collection);
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex(
          (c) => c._id === action.payload.collection._id
        );
        if (index !== -1) {
          state.collections[index] = action.payload.collection;
        }
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.collections = state.collections.filter(
          (c) => c._id !== action.payload
        );
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      });
  },
});

export const { reset } = collectionSlice.actions;
export default collectionSlice.reducer;
