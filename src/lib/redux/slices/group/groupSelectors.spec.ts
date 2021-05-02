import {RootState} from '../../store';
import {
  GroupWithOwnerAndMembersAndInvitesAndCars,
  GroupWithOwner,
  CarWithDriver,
  InviteWithUserAndInviteSender,
  Member,
} from '../../../../lib';
import {CarColor} from '../../../api';
import {
  getGroupCars,
  getGroupInvites,
  getMembers,
  getNotSelectedGroups,
  getSelectedGroup,
} from './groupSelectors';

describe('groupSelectors', () => {
  let state: Partial<RootState>;
  let cars: CarWithDriver[];
  let members: Member[];
  let invites: InviteWithUserAndInviteSender[];
  let group: GroupWithOwnerAndMembersAndInvitesAndCars;
  let groups: GroupWithOwner[];

  beforeEach(() => {
    cars = [
      {
        groupId: 1,
        carId: 1,
        name: 'CAR',
        color: CarColor.Red,
        createdAt: new Date(),
        updatedAt: new Date(),
        driverId: null,
        Driver: null,
        latitude: 1.0,
        longitude: 2.0,
      },
    ];

    members = [
      {
        isAdmin: true,
        User: {
          id: 1,
          username: 'OWNER',
        },
      },
      {
        isAdmin: false,
        User: {
          id: 2,
          username: 'MEMBER',
        },
      },
    ];

    invites = [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: 1,
        userId: 3,
        User: {
          id: 3,
          username: 'INVITED',
        },
        invitedBy: 1,
        InviteSender: {
          id: 1,
          username: 'OWNER',
        },
      },
    ];

    group = {
      id: 1,
      name: 'GROUP',
      description: 'DESC',
      createdAt: new Date(),
      updatedAt: new Date(),
      cars,
      members,
      invites,
      ownerId: 1,
      Owner: {
        id: 1,
        username: 'OWNER',
      },
    };

    groups = [
      {
        ...group,
      },
      {
        id: 2,
        name: 'OTHER',
        description: 'OTHER',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 1,
        Owner: {
          id: 1,
          username: 'OWNER',
        },
      },
    ];

    state = {
      group: {
        loading: false,
        ids: groups.map((g) => g.id),
        entities: groups.reduce((p, c) => ({...p, [c.id]: c}), {}),
        selectedGroup: group,
      },
    };
  });

  it('getSelectedGroup returns selected group', () => {
    expect(getSelectedGroup(state)).toEqual(group);
  });

  describe('getGroupCars', () => {
    it('if group selected, returns cars', () => {
      expect(getGroupCars(state)).toEqual(cars);
    });

    it('if no group selected, returns undefined', () => {
      state.group.selectedGroup = null;

      expect(getGroupCars(state)).toBeUndefined();
    });
  });

  describe('getNotSelectedGroups', () => {
    it('if group selected, returns alls groups except selected', () => {
      const notSelectedGroups = getNotSelectedGroups(state);

      expect(notSelectedGroups).toHaveLength(1);
      expect(notSelectedGroups).toContainEqual(groups[1]);
    });

    it('if no group selected, returns all groups', () => {
      state.group.selectedGroup = null;

      expect(getNotSelectedGroups(state)).toEqual(groups);
    });
  });

  describe('getMembers', () => {
    it('if group selected, returns members', () => {
      expect(getMembers(state)).toEqual(members);
    });

    it('if no group selected, returns undefined', () => {
      state.group.selectedGroup = null;

      expect(getMembers(state)).toBeUndefined();
    });
  });

  describe('getGroupInvites', () => {
    it('if group selected, returns invites', () => {
      expect(getGroupInvites(state)).toEqual(invites);
    });

    it('if no group selected, returns undefined', () => {
      state.group.selectedGroup = null;

      expect(getGroupInvites(state)).toBeUndefined();
    });
  });
});
