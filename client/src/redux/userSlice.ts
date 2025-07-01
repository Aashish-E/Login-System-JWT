import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
  isAuthenticated: false,
  token: null,
  status: 'idle',
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData: { identifier: string; password: string }) => {
    const response = await axiosInstance.post('/user/login', userData);
    localStorage.setItem('userToken', response.data.token);
    return response.data;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('userToken');
  return {};
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { username: string; firstname: string; lastname: string; countryPhoneCode: number; mobileNumber: number; email: string; password: string; dob: Date }) => {
    const response = await axiosInstance.post('/user/register', userData);
    return response.data;
  }
);

export const validateToken = createAsyncThunk(
  'user/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/profile');
      return response.data;
    } catch (error) {
      localStorage.removeItem('userToken');
      return rejectWithValue('Invalid token');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<{ token: string | null }>) {
      state.isAuthenticated = !!action.payload.token;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.status = 'idle';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.status = 'idle';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(validateToken.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.status = 'idle';
      })
      .addCase(validateToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.status = 'failed';
      });
  },
});

export const { setAuthState } = userSlice.actions;

export default userSlice.reducer;
