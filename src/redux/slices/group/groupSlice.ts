import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';

/**
 * Create group slice.
 */
const groupSlice = createSlice({
  name: 'group',
  initialState: {
    test: 0,
  },
  reducers: {
    increment: (state) => {
      state.test += 1;
    },
    decrement: (state) => {
      state.test -= 1;
    },
  },
});

export const {increment, decrement} = groupSlice.actions;

export const groupSelector = (state: RootState): number => state.group.test;

export default groupSlice.reducer;
