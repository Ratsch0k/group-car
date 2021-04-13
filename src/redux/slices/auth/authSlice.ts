import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {User} from 'lib';
import {
  login as loginApi,
  logout as logoutApi,
  signUp as signUpApi,
  checkLoggedIn as checkLoggedInApi,
} from 'lib/api';
import {RootState} from 'redux/store';
import {isCompletedMatcher, isPendingMatcher} from 'redux/util';

export interface AuthState {
  user: User | undefined;
  loading: boolean;
  signUpRequestSent: boolean;
}

const initialState: AuthState = {
  loading: false,
  user: undefined,
  signUpRequestSent: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
    },
    setSignUpRequestSent: (state, action: PayloadAction<boolean>) => {
      state.signUpRequestSent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isPendingMatcher, (state) => {
      state.loading = true;
    }).addMatcher(isCompletedMatcher, (state) => {
      state.loading = false;
    });
  },
});

export const {setUser, setSignUpRequestSent} = authSlice.actions;


interface LoginParams {
  username: string;
  password: string;
}
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginParams, thunkApi) => {
    const res = await loginApi(data.username, data.password);

    thunkApi.dispatch(setUser(res.data));
    return res;
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {dispatch}) => {
    const res = await logoutApi();

    dispatch(setUser(undefined));

    return res;
  },
);

interface SignUpParams {
  username: string;
  email: string;
  password: string;
  offset: number;
}
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpParams, {dispatch}) => {
    const res = await signUpApi(
      data.username,
      data.email,
      data.password,
      data.offset,
    );

    if ((res.data as User).id) {
      dispatch(setUser(res.data as User));
    } else {
      dispatch(setSignUpRequestSent(true));
    }

    return res;
  },
);

export const checkLoggedIn = createAsyncThunk(
  'auth/checkLoggedIn',
  async (_, {dispatch}) => {
    try {
      const res = await checkLoggedInApi();
      dispatch(setUser(res.data));
    } catch (e) {
      console.dir(e);
      dispatch(setUser(undefined));
    }
  },
);

export const isLoggedIn = (state: RootState): boolean =>
  state.auth.user !== undefined;
export const getUser = (state: RootState): User | undefined => state.auth.user;
export const isLoading = (state: RootState): boolean => state.auth.loading;
export const signUpRequestSent = (state: RootState): boolean =>
  state.auth.signUpRequestSent;

export default authSlice.reducer;
