describe('groupThunks', () => {
  describe('selectAndUpdateGroup', () => {
    describe('if no group selected', () => {
      describe('if group with id in groups', () => {
        it.todo('get group data and dispatch selectGroup with response');
      });

      describe('if force is true', () => {
        it.todo('get group data and dispatch selectGroup with response');
      });
    });

    describe('if group with same id selected', () => {
      describe('if group with id in groups', () => {
        it.todo('get group data and dispatch selectGroup with response');
      });

      describe('if force is true', () => {
        it.todo('get group data and dispatch selectGroup with response');
      });
    });

    it.todo('if api call reject, return rejectWithValue ' +
    'with error data from response');
  });

  describe('updateSelectedGroup', () => {
    it.todo('get group data and dispatch setSelectedGroup with response data');

    it.todo('if response rejected, returns ' +
    'rejectWithValue with error response data');
  });

  describe('createGroup', () => {
    it.todo('call createGroup api, get group data, ' +
    'dispatch add group and setSelectedGroup');

    it.todo('if createGroup request rejected, ' +
    'returns rejectWithValue with error');

    it.todo('if getGroup request rejected, returns rejectWithValue with error');
  });

  describe('update', () => {
    it.todo('get groups and updates groups');

    it.todo('if a group selected, dispatches updateSelectedGroup');

    it.todo('if request rejected, returns rejectWithValue with error');
  });

  describe('getGroup', () => {
    it.todo('get group data and dispatch updateGroup');

    it.todo('if request rejected, returns rejectWithValue with error');
  });

  describe('inviteUser', () => {
    describe('requests invite user', () => {
      it.todo('if group selected for which invite is, dispatch addInvite');

      it.todo('if the group is not selected, do not dispatch addInvite');

      it.todo('if request rejected, returns rejectWithValue with error');
    });
  });

  describe('leaveGroup', () => {
    it.todo('requests leaveGroup and dispatches removeGroupWithId action');

    it.todo('if request rejected, returns rejectWithValue with error');
  });

  describe('deleteGroup', () => {
    it.todo('request deleteGroup and dispatches removeGroupWithId action');

    it.todo('if request rejected, returns rejectWithValue with error');
  });

  describe('driveCar', () => {
    it.todo('dispatch setDriverOfCar, if ' +
    'user defined, correct group selected and car is in list');

    it.todo('if request rejected, returns rejectWithValue with error');
  });

  describe('parkCar', () => {
    it.todo('dispatch setLocationOfCar, if ' +
    'user defined, correct group selected and car is in list');

    it.todo('if request rejected, returns rejectWithValue with error');
  });

  describe('createCar', () => {
    it.todo('request createCar, dispatches addCar if correct group selected');

    it.todo('if request rejected, returns rejectWithValue with error');
  });

  describe('grantAdminRights', () => {
    it.todo('rejects with NotLoggedInError if user not defined');

    it.todo('rejects with NotAdminOfGroup if user not admin of group');

    it.todo('rejects with NoGroupSelected if no group selected');

    it.todo('if group selected, user defined, user admin of group, ' +
    'request grantAdmin and set admin of member to true');

    it.todo('if request rejected, returns rejectWithValue with error');
  });

  describe('revokeAdminRights', () => {
    it.todo('rejects with NotLoggedInError if user not defined');

    it.todo('rejects with NotAdminOfGroup if user not admin of group');

    it.todo('rejects with NoGroupSelected if no group selected');

    it.todo('if group selected, user defined, user admin of group, ' +
    'request revokeAdmin and set admin of member to false');

    it.todo('if revokingAdmin of admin, and user is not owner, ' +
    'reject with NotAdminOfGroup');

    it.todo('if revokingAdmin of admin, and user is owner, revoke admin');

    it.todo('if request rejected, returns rejectWithValue with error');
  });
});
