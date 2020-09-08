import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  useApi,
  useStateIfMounted,
  Api,
  GroupWithOwnerAndMembers,
  AuthContext,
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
  selectedGroup: GroupWithOwnerAndMembers | null;

  /**
   * All groups of which the current user is a member of.
   */
  groups: GroupWithOwnerAndMembers[];

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
  const {getGroups, createGroup: createGroupApi, getGroup} = useApi();
  const [groups, setGroups] = useStateIfMounted<GroupContext['groups']>([]);
  const [selectedGroup, setSelectedGroup] =
    useState<GroupContext['selectedGroup']>(null);

  const selectGroup: GroupContext['selectGroup'] = (id: number) => {
    if (selectedGroup === null || selectedGroup.id !== id) {
      const groupWithId = groups.find((group) => group.id === id);

      if (groupWithId) {
        setSelectedGroup(groupWithId);
      }
    }
  };

  const update = useCallback(async () => {
    const getGroupsResponse = await getGroups();

    setGroups(getGroupsResponse.data.groups);

    // Check if selected group stil exists
    if (selectedGroup !== null &&
        !getGroupsResponse.data.groups
            .some((group) => group.id === selectedGroup.id)) {
      setSelectedGroup(null);
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


  return (
    <GroupContext.Provider value={{
      groups,
      selectedGroup,
      selectGroup,
      update,
      createGroup,
    }}>
      {props.children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
