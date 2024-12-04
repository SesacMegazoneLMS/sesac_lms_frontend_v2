import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  userType: 'student' // 기본 사용자 타입 추가
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        ...action.payload,
        userType: action.payload.role || 'student' // role 필드를 userType으로 매핑
      };
      // 강사인 경우 instructor로 설정
      state.userType = action.payload.role === 'instructor' ? 'instructor' : 'student';
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      return initialState;
    },
    updateUserProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      };
    }
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout,
  updateUserProfile 
} = authSlice.actions;

export default authSlice.reducer;