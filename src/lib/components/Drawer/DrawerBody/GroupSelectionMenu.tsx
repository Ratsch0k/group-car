import React, {useState, useEffect} from 'react';
import {useGroups} from 'lib/hooks';
import {MenuList, Box, IconButton, MenuItem} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export interface GroupSelectionMenuProps {
  goBack(): void;
  close(): void;
}

export const GroupSelectionMenu: React.FC<GroupSelectionMenuProps> =
(props: GroupSelectionMenuProps) => {
  const {selectedGroup, groups, selectGroup} = useGroups();
  const [groupItems, setGroupItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Build menu items for all groups
    let filteredGroups;
    if (selectedGroup) {
      filteredGroups = groups.filter((group) => group.id !== selectedGroup.id);
    } else {
      filteredGroups = groups;
    }

    const items = filteredGroups.map((group) => {
      return (
        <MenuItem
          key={`select-group-${group.id}`}
          button
          onClick={() => {
            selectGroup(group.id);
            props.close();
          }}
        >
          {group.name}
        </MenuItem>
      );
    });

    setGroupItems(items);
  }, [groups, selectedGroup, props, selectGroup]);


  return (
    <Box>
      <IconButton
        onClick={props.goBack}
        color='inherit'
      >
        <ArrowBackIcon/>
      </IconButton>
      <MenuList>
        {groupItems}
      </MenuList>
    </Box>
  );
};

export default GroupSelectionMenu;
