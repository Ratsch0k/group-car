import {InvitesState, invitesSlice} from './invitesSlice';

describe('invitesSlice', () => {
  it('reset, resets state to initial state', () => {
    const state: InvitesState = {
      loading: true,
      ids: [1, 2, 3],
      entities: {
        1: {
          groupId: 1,
          userId: 1,
        },
        2: {
          groupId: 2,
          userId: 1,
        },
        3: {
          groupId: 3,
          userId: 1,
        },
      },
    };

    invitesSlice.caseReducers.reset(state);

    expect(state.loading).toBe(false);
    expect(state.ids).toEqual([]);
    expect(state.entities).toEqual({});
  });
});
