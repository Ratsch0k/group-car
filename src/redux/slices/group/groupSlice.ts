import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {CarWithDriver, GroupWithOwner} from 'lib';
import axios from 'lib/client';

interface GroupState {
  /**
   * The selected group.
   *
   * If no group is selected this is null.
   */
  selectedGroup: GroupWithOwner | null;

  /**
      * The cars of the selected group.
      *
      * If none is selected this is null.
      */
  groupCars: CarWithDriver[] | null;

  /**
      * All groups of which the current user is a member of.
      */
  groups: GroupWithOwner[];

  loading: boolean,
  test: number;
  successful: boolean;
  failed: boolean;
}


const initialState: GroupState = {
  selectedGroup: null,
  groupCars: null,
  groups: [],
  test: 0,
  loading: false,
  successful: false,
  failed: false,
};

/*
 * Create reducers.
 */

export const testThunk = createAsyncThunk('/group/asyncTest', async () => {
  await axios.head('/auth');

  return {
    test: 'payload',
    otherTest: 'other payload',
  };
});

/**
 * Create group slice.
 */
const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    increment: (state) => {
      state.test += 1;
    },
    decrement: (state) => {
      state.test -= 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(testThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(testThunk.fulfilled, (state) => {
      state.loading = false;
      state.successful = true;
    });
    builder.addCase(testThunk.rejected, (state) => {
      state.loading = false;
      state.failed = true;
    });
  },
});

export const {increment, decrement} = groupSlice.actions;

export const groupSelector = (state: RootState): number => state.group.test;

export const isLoading = (state: RootState): boolean => state.group.loading;

export const wasSuccessful = (state: RootState): boolean =>
  state.group.successful;

export const hasFailed = (state: RootState): boolean => state.group.failed;

export default groupSlice.reducer;
