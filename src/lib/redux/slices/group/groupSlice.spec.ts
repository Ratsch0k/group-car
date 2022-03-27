import {GroupWithOwner} from '../../../../lib';
import {
  addCar,
  addInvite,
  GroupState, removeCar,
  removeGroupWithId,
  selectGroup,
  setAdminOfMember,
  setDriverOfCar,
  setLocationOfCar,
  setSelectedGroup,
  updateCar,
  updateGroup,
  updateGroups,
} from './groupSlice';
import {groupSlice} from './groupSlice';
import {EntityState} from '@reduxjs/toolkit';
import {createDraft, Draft} from 'immer';
import {
  CarColor,
  CarWithDriver,
  GroupWithOwnerAndCars,
  InviteWithUserAndInviteSender,
  Member,
} from '../../../api';

describe('groupSlice', () => {
  let state: Draft<GroupState & EntityState<GroupWithOwner>>;
  let car: CarWithDriver;
  let group1: GroupWithOwner;
  let group2: GroupWithOwner;

  beforeEach(() => {
    group1 = {
      id: 1,
      name: 'GROUP1',
      description: 'DESC',
      ownerId: 1,
      Owner: {
        id: 1,
        username: 'OWNER',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    group2 = {
      id: 2,
      name: 'GROUP2',
      description: 'DESC2',
      ownerId: 2,
      Owner: {
        id: 2,
        username: 'OWNER2',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    car = {
      name: 'CAR',
      color: CarColor.Red,
      createdAt: new Date(),
      updatedAt: new Date(),
      groupId: group1.id,
      carId: 1,
      driverId: null,
      Driver: null,
      latitude: null,
      longitude: null,
    };

    state = createDraft({
      ids: [],
      entities: {},
      selectedGroup: null,
      loading: false,
    });
  });

  describe('actions', () => {
    describe('selectGroup', () => {
      it('if group is in list of group, ' +
      'update group and set selected group', () => {
        state.entities = {1: group1, 2: group2};
        state.ids = [1, 2];

        const updatedGroup = {
          ...group1,
          name: 'NEW NAME',
          description: 'NEW DESC',
        };

        groupSlice.caseReducers
          .selectGroup(state, selectGroup({group: updatedGroup}));

        expect(state.selectedGroup).toEqual(updatedGroup);
        expect(state.entities[1]).toEqual(updatedGroup);
      });

      it('if group is not in groups and ' +
      'force not true, does nothing', () => {
        const updatedGroup = {
          ...group1,
          name: 'NEW NAME',
          description: 'NEW DESC',
        };

        groupSlice.caseReducers
          .selectGroup(state, selectGroup({group: updatedGroup}));

        expect(state.selectedGroup).toBeNull();
        expect(state.entities[1]).toBeUndefined();
      });

      it('if group is not in groups and force is true, ' +
      'update group and set selected group', () => {
        const updatedGroup = {
          ...group1,
          name: 'NEW NAME',
          description: 'NEW DESC',
        };

        groupSlice.caseReducers
          .selectGroup(state, selectGroup({group: updatedGroup, force: true}));

        expect(state.selectedGroup).toEqual(updatedGroup);
        expect(state.entities[1]).toEqual(updatedGroup);
        expect(state.ids).toHaveLength(1);
      });
    });

    describe('updateGroups', () => {
      it('sets list of group to argument', () => {
        const groups = [group1, group2];

        groupSlice.caseReducers.updateGroups(state, updateGroups(groups));

        expect(state.ids).toHaveLength(2);
        expect(state.entities[1]).toEqual(group1);
        expect(state.entities[2]).toEqual(group2);
      });

      describe('if a group is selected', () => {
        it('and not in list, set to null', () => {
          state.ids = [group1.id];
          state.entities = {[group1.id]: group1};
          state.selectedGroup = group1;


          groupSlice.caseReducers.updateGroups(state, updateGroups([]));

          expect(state.selectedGroup).toBeNull();
        });

        it('and in list, update it', () => {
          state.ids = [group1.id];
          state.entities = {[group1.id]: group1};
          state.selectedGroup = group1;

          const updatedGroup = {
            ...group1,
            name: 'NEW NAME',
            description: 'NEW DESC',
          };

          groupSlice.caseReducers
            .updateGroups(state, updateGroups([updatedGroup]));

          expect(state.selectedGroup).toEqual(updatedGroup);
          expect(state.entities[group1.id]).toEqual(updatedGroup);
        });
      });
    });

    describe('updateGroup', () => {
      it('if group in list, update it', () => {
        state.ids = [group1.id];
        state.entities = {[group1.id]: group1};

        const updatedGroup = {
          ...group1,
          name: 'NEW NAME',
          description: 'NEW DESC',
        };

        groupSlice.caseReducers.updateGroup(state, updateGroup(updatedGroup));

        expect(state.ids).toHaveLength(1);
        expect(state.entities[1]).toEqual(updatedGroup);
      });

      it('if group not in list, do not update', () => {
        state.ids = [group2.id];
        state.entities = {[group2.id]: group2};

        const updatedGroup = {
          ...group1,
          name: 'NEW NAME',
          description: 'NEW DESC',
        };

        groupSlice.caseReducers.updateGroup(state, updateGroup(updatedGroup));

        expect(state.ids).toHaveLength(1);
        expect(state.entities[2]).toEqual(group2);
      });

      it('if selected group is the group, update it', () => {
        state.ids = [group1.id];
        state.entities = {[group1.id]: group1};
        state.selectedGroup = group1;

        const updatedGroup = {
          ...group1,
          name: 'NEW NAME',
          description: 'NEW DESC',
        };

        groupSlice.caseReducers.updateGroup(state, updateGroup(updatedGroup));

        expect(state.ids).toHaveLength(1);
        expect(state.entities[1]).toEqual(updatedGroup);
        expect(state.selectedGroup).toEqual(updatedGroup);
      });

      it('if not selected group, do not update', () => {
        state.ids = [group1.id];
        state.entities = {[group1.id]: group1};
        state.selectedGroup = group2;

        const updatedGroup = {
          ...group1,
          name: 'NEW NAME',
          description: 'NEW DESC',
        };

        groupSlice.caseReducers.updateGroup(state, updateGroup(updatedGroup));

        expect(state.ids).toHaveLength(1);
        expect(state.entities[1]).toEqual(updatedGroup);
        expect(state.selectedGroup).toEqual(group2);
      });
    });

    describe('removeGroupWithId', () => {
      it('remove group from list', () => {
        state.ids = [group1.id, group2.id];
        state.entities = {[group1.id]: group1, [group2.id]: group2};

        groupSlice.caseReducers
          .removeGroupWithId(state, removeGroupWithId(group1.id));

        expect(state.entities[group1.id]).toBeUndefined();
        expect(state.ids).toHaveLength(1);
        expect(state.ids).toContain(group2.id);
      });

      it('if group to remove is selected group, set to null', () => {
        state.ids = [group1.id, group2.id];
        state.entities = {[group1.id]: group1, [group2.id]: group2};
        state.selectedGroup = group1;

        groupSlice.caseReducers
          .removeGroupWithId(state, removeGroupWithId(group1.id));

        expect(state.entities[group1.id]).toBeUndefined();
        expect(state.ids).toHaveLength(1);
        expect(state.ids).toContain(group2.id);
        expect(state.selectedGroup).toBeNull();
      });
    });

    describe('setDriverOfCar', () => {
      it('if no group selected, do nothing', () => {
        const previousState = Object.assign({}, state);

        const arg = {groupId: 1, carId: 1, driver: {id: 1, username: 'user'}};
        groupSlice.caseReducers.setDriverOfCar(state, setDriverOfCar(arg));

        expect(state).toEqual(previousState);
      });

      describe('if group selected', () => {
        it('if car not in list, do nothing', () => {
          const group = {
            ...group1,
            members: [],
            cars: [],
            invites: [],
          };

          state.selectedGroup = group;

          const arg = {groupId: 1, carId: 1, driver: {id: 1, username: 'user'}};
          groupSlice.caseReducers.setDriverOfCar(state, setDriverOfCar(arg));

          expect(state.selectedGroup).toEqual(group);
        });

        it('if car in list, set driver and unset location', () => {
          car.latitude = 1.0;
          car.longitude = 1.0;

          const group = {
            ...group1,
            members: [],
            cars: [car],
            invites: [],
          };

          state.selectedGroup = group;

          const arg = {groupId: 1, carId: 1, driver: {id: 1, username: 'user'}};
          groupSlice.caseReducers.setDriverOfCar(state, setDriverOfCar(arg));

          const expectedCar: CarWithDriver = {
            ...car,
            latitude: null,
            longitude: null,
            driverId: arg.driver.id,
            Driver: arg.driver,
          };

          expect(state.selectedGroup.cars).toContainEqual(expectedCar);
          expect(state.selectedGroup.cars).toHaveLength(1);
        });
      });
    });

    describe('setLocationOfCar', () => {
      it('if no group selected, do nothing', () => {
        const previousState = Object.assign({}, state);

        const arg = {groupId: 1, carId: 1, latitude: 1.0, longitude: 1.0};
        groupSlice.caseReducers.setLocationOfCar(state, setLocationOfCar(arg));

        expect(state).toEqual(previousState);
      });

      describe('if group selected', () => {
        it('if car not in list, do nothing', () => {
          const group = {
            ...group1,
            members: [],
            cars: [],
            invites: [],
          };

          state.selectedGroup = group;

          const arg = {groupId: 1, carId: 1, latitude: 1.0, longitude: 1.0};
          groupSlice.caseReducers
            .setLocationOfCar(state, setLocationOfCar(arg));

          expect(state.selectedGroup).toEqual(group);
        });

        it('if car in list, unset driver and set location', () => {
          car.Driver = {
            username: 'user',
            id: 1,
          };
          car.driverId = 1;
          const group = {
            ...group1,
            members: [],
            cars: [car],
            invites: [],
          };

          state.selectedGroup = group;

          const arg = {groupId: 1, carId: 1, latitude: 1.0, longitude: 1.0};
          groupSlice.caseReducers
            .setLocationOfCar(state, setLocationOfCar(arg));

          const expectedCar: CarWithDriver = {
            ...car,
            latitude: 1.0,
            longitude: 1.0,
            driverId: null,
            Driver: null,
          };

          expect(state.selectedGroup.cars).toContainEqual(expectedCar);
          expect(state.selectedGroup.cars).toHaveLength(1);
        });
      });
    });

    describe('addCar', () => {
      it('if group selected, add car', () => {
        const group = {
          ...group1,
          members: [],
          cars: [],
          invites: [],
        };

        state.selectedGroup = group;

        groupSlice.caseReducers.addCar(state, addCar(car));

        expect(state.selectedGroup.cars).toHaveLength(1);
        expect(state.selectedGroup.cars).toContainEqual(car);
      });

      it('if no group selected, do not add', () => {
        groupSlice.caseReducers.addCar(state, addCar(car));

        expect(state.selectedGroup).toBeNull();
      });
    });

    describe('updateCar', () => {
      it('if no group selected, do nothing', () => {
        const previousState = Object.assign({}, state);

        groupSlice.caseReducers.updateCar(state, updateCar(car));

        expect(state).toEqual(previousState);
      });

      it('if selected group is not group of car, do nothing', () => {
        state.selectedGroup = {
          ...group2,
          members: [],
          cars: [
            {
              ...car,
              id: group2.id,
            },
          ],
        };

        const previousState = Object.assign({}, state);

        groupSlice.caseReducers.updateCar(state, updateCar(car));

        expect(state).toEqual(previousState);
      });

      it('if car is not in selected group, do nothing', () => {
        state.selectedGroup = {
          ...group1,
          members: [],
          cars: [],
          invites: [],
        };

        groupSlice.caseReducers.updateCar(state, updateCar(car));

        expect(state.selectedGroup.cars).toHaveLength(0);
      });

      it('if car is in group, update it', () => {
        state.selectedGroup = {
          ...group1,
          members: [],
          cars: [car],
          invites: [],
        };

        const updatedCar = {
          ...car,
          name: 'NEW CAR',
          color: CarColor.Black,
        };

        groupSlice.caseReducers.updateCar(state, updateCar(updatedCar));

        expect(state.selectedGroup.cars).toHaveLength(1);
        expect(state.selectedGroup.cars[0]).toEqual(updatedCar);
      });
    });

    describe('setSelectedGroup', () => {
      it('set selected group', () => {
        groupSlice.caseReducers
          .setSelectedGroup(state, setSelectedGroup(group1));

        expect(state.selectedGroup).toEqual(group1);
      });
    });

    describe('addInvite', () => {
      it('if group selected and no ' +
      'invite for user, add invite', () => {
        const invite: InviteWithUserAndInviteSender = {
          userId: 2,
          groupId: group1.id,
          invitedBy: 1,
          InviteSender: {
            id: 1,
            username: 'inviter',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          User: {
            id: 2,
            username: 'invited',
          },
        };

        state.selectedGroup = {
          ...group1,
          invites: [invite],
        };

        const newInvite: InviteWithUserAndInviteSender = {
          userId: 3,
          groupId: group1.id,
          invitedBy: 1,
          InviteSender: {
            id: 1,
            username: 'inviter',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          User: {
            id: 3,
            username: 'new',
          },
        };

        groupSlice.caseReducers.addInvite(state, addInvite(newInvite));

        expect(state.selectedGroup.invites).toHaveLength(2);
        expect(state.selectedGroup.invites).toContainEqual(newInvite);
      });
    });

    describe('reset', () => {
      it('set selected group to null, loading to false, remove groups', () => {
        state.ids = [group1.id, group2.id];
        state.entities = {
          [group1.id]: group1,
          [group2.id]: group2,
        };
        state.selectedGroup = group1;
        state.loading = true;

        groupSlice.caseReducers.reset(state);

        expect(state.ids).toHaveLength(0);
        expect(state.entities).toEqual({});
        expect(state.selectedGroup).toBeNull();
        expect(state.loading).toBe(false);
      });
    });

    describe('setAdminOfMember', () => {
      it('if group selected group and member exists, set isAdmin field', () => {
        const member: Member = {
          isAdmin: false,
          User: {
            id: 1,
            username: 'member',
          },
        };

        state.selectedGroup = {
          ...group1,
          members: [member],
        };

        const arg = {groupId: group1.id, userId: member.User.id, isAdmin: true};
        groupSlice.caseReducers.setAdminOfMember(state, setAdminOfMember(arg));

        expect(state.selectedGroup.members).toContainEqual({
          ...member,
          isAdmin: true,
        });
      });
    });

    describe('removeCar', () => {
      it('removes a car if it belongs to the selected group', () => {
        // Prepare state and args for reducer
        (group1 as GroupWithOwnerAndCars).cars = [car];
        state.selectedGroup = group1;

        const arg = {groupId: car.groupId, carId: car.carId};

        groupSlice.caseReducers.removeCar(state, removeCar(arg));

        // Check if car is removed
        expect(state.selectedGroup.cars).toHaveLength(0);
      });

      it('does nothing if any other group is selected', () => {
        // Create new fake car
        const otherCar: CarWithDriver = {
          groupId: group2.id,
          carId: 1,
          color: CarColor.Red,
          createdAt: new Date(0),
          updatedAt: new Date(0),
          name: 'OTHER_CAR',
          latitude: null,
          longitude: null,
          driverId: null,
          Driver: null,
        };

        // Prepare state and args for reducer
        (group2 as GroupWithOwnerAndCars).cars = [otherCar];
        state.selectedGroup = group2;

        // Make copy of state
        const previousState = Object.assign({}, state);

        const arg = {groupId: car.groupId, carId: car.carId};

        groupSlice.caseReducers.removeCar(state, removeCar(arg));

        expect(state).toEqual(previousState);
      });
    });
  });
});
