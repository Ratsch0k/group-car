import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  useApi,
  useStateIfMounted,
  Api,
  AuthContext,
  GroupWithOwner,
} from 'lib';

/**
 * Context for the group context.
 */
export interface GroupContext {
  /**
   * The selected group.
   *
   * If no group is selected this is null.
   */
  selectedGroup: GroupWithOwner | null;

  /**
   * All groups of which the current user is a member of.
   */
  groups: GroupWithOwner[];

  /**
   * Select the group with the specified id. The
   * attribute `selectedGroup` will then have the
   * data of that group.
   * @param id  The id of the group which to select.
   */
  selectGroup(id: number): void;

  /**
   * Creates a group with the specified data.
   */
  createGroup: Api['createGroup'];

  /**
   * Updates the context by reloading all
   * groups.
   */
  update(): Promise<void>;

  /**
   * Gets the specified group.
   *
   * This method will not use the
   * `groups` array but will instead load
   * the group data from the server.
   * Because of this, the gotten group
   * data will contain more information,
   * for example the list of members.
   * This method has the side effect, that it will
   * update the `groups` array if the array
   * only contains the simpler version
   * of the group data.
   */
  getGroup: Api['getGroup'];

  /**
   * Invites the specified user to the specified group.
   */
  inviteUser: Api['inviteUser'];

  /**
   * Leave the specified group.
   */
  leaveGroup: Api['leaveGroup'];
}

/**
 * Group context.
 * Stores the currently selected group and all other groups
 * where the user is a member.
 */
export const GroupContext = React.createContext<GroupContext>({
  selectedGroup: null,
  groups: [],
  selectGroup: () => undefined,
  update: () => Promise.reject(new Error('Not defined yet')),
  createGroup: () => Promise.reject(new Error('Not defined yet')),
  getGroup: () => Promise.reject(new Error('Not defined yet')),
  inviteUser: () => Promise.reject(new Error('Not defined yet')),
  leaveGroup: () => Promise.reject(new Error('Not defined yet')),
});
GroupContext.displayName = 'GroupContext';

/**
 * Element for creating and providing the `GroupContext`.
 * Will load groups and define all needed values.
 *
 * This element expects the `AuthContext` and
 * `ApiContext` to be higher
 * in the tree. The `AuthContext` is needed
 * because it will reload all groups if
 * the logged in user changes and the `ApiContext`
 * is needed because it needs the api calls to load
 * group data.
 * @param props Children.
 */
export const GroupProvider: React.FC = (props) => {
  const {user} = useContext(AuthContext);
  const {
    getGroups,
    createGroup: createGroupApi,
    getGroup: getGroupApi,
    inviteUser,
    leaveGroup: leaveGroupApi,
  } = useApi();
  const [groups, setGroups] = useStateIfMounted<GroupContext['groups']>([]);
  const [selectedGroup, setSelectedGroup] =
    useState<GroupContext['selectedGroup']>(null);

  const selectGroup: GroupContext['selectGroup'] = (id: number) => {
    if (selectedGroup === null || selectedGroup.id !== id) {
      const group = groups.find((group) => group.id === id);

      if (group) {
        setSelectedGroup(group);
      }
    }
  };

  const update = useCallback(async () => {
    const getGroupsResponse = await getGroups();
    const newGroups = getGroupsResponse.data.groups;

    setGroups(newGroups);

    // Check if selected group stil exists
    if (selectedGroup !== null) {
      const selectedGroupFromData = newGroups.find((group) =>
        group.id === selectedGroup.id);

      /*
       * If the user is still a member of the selected group,
       * update the group data. If not, remove that group.
       */
      if (!selectedGroupFromData) {
        setSelectedGroup(null);
      } else {
        setSelectedGroup(selectedGroupFromData);
      }
    }
  }, [getGroups, setGroups, selectedGroup]);

  useEffect(() => {
    if (user) {
      update();
    }
    // eslint-disable-next-line
  }, [user]);

  const createGroup: GroupContext['createGroup'] =
  async (name, description) => {
    const createGroupResponse = await createGroupApi(name, description);

    /*
     * Get the data of the created group,
     * set the selected group to it and update list of groups
    */
    const newGroup = (await getGroup(createGroupResponse.data.id)).data;
    setSelectedGroup(newGroup);
    setGroups((prev) => [...prev, newGroup]);

    return createGroupResponse;
  };

  const getGroup: GroupContext['getGroup'] = async (id) => {
    const getGroupResponse = await getGroupApi(id);
    const newGroup = getGroupResponse.data;

    /*
     * Check if the received group is in the groups array and if
     * it's the selected group. Update accordingly.
     */
    if (selectedGroup?.id === newGroup.id) {
      setSelectedGroup(newGroup);
    }
    const indexOfGroup = groups.findIndex((group) => group.id === newGroup.id);
    if (indexOfGroup !== -1) {
      setGroups((prev) => {
        prev[indexOfGroup] = newGroup;
        return prev;
      });
    }

    return getGroupResponse;
  };

  const leaveGroup: GroupContext['leaveGroup'] = async (id) => {
    const res = await leaveGroupApi(id);
    if (id === selectedGroup?.id) {
      setSelectedGroup(null);
      setGroups((prev) => prev.filter((group) => group.id !== id));
    }

    return res;
  };

  return (
    <GroupContext.Provider value={{
      groups,
      selectedGroup,
      selectGroup,
      update,
      createGroup,
      getGroup,
      inviteUser,
      leaveGroup,
    }}>
      {props.children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
