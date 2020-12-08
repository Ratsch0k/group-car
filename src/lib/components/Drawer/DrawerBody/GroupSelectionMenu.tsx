import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import {useGroups} from 'lib/hooks';
import {
  MenuList,
  Box,
  IconButton,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

/**
 * Props for the group selection menu.
 */
export interface GroupSelectionMenuProps {
  /**
   * Callback which will be called when the back button is clicked.
   */
  goBack(): void;
  /**
   * Callback for closing the menu.
   */
  close(): void;

  /**
   * Whether or not this component should be in the loading state.
   */
  loading: boolean;

  /**
   * Set the loading state.
   */
  setLoading: Dispatch<SetStateAction<boolean>>;
}

/**
 * Style.
 */
const useStyles = makeStyles({
  list: {
    maxHeight: 300,
    overflowY: 'auto',
  },
});

/**
 * Group selection menu component.
 * Displays the list of groups as a menu list.
 * By clicking on a specific item, the group is selected.
 * @param props Props.
 */
export const GroupSelectionMenu: React.FC<GroupSelectionMenuProps> =
(props: GroupSelectionMenuProps) => {
  const {selectedGroup, groups, selectGroup} = useGroups();
  const [groupItems, setGroupItems] = useState<JSX.Element[]>([]);
  const classes = useStyles();

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
          disabled={props.loading}
          onClick={async () => {
            props.setLoading(true);
            try {
              await selectGroup(group.id);
              props.setLoading(false);
              props.close();
            } catch {
              props.setLoading(false);
            }
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
        disabled={props.loading}
      >
        <ArrowBackIcon/>
      </IconButton>
      <MenuList className={classes.list}>
        {groupItems}
      </MenuList>
    </Box>
  );
};

export default GroupSelectionMenu;
