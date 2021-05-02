import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import {
  MenuList,
  Box,
  IconButton,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {
  getNotSelectedGroups,
  selectAndUpdateGroup,
} from 'lib/redux/slices/group';
import {unwrapResult} from '@reduxjs/toolkit';

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
  const dispatch = useAppDispatch();
  const notSelectedGroups = useShallowAppSelector(getNotSelectedGroups);
  const [groupItems, setGroupItems] = useState<JSX.Element[]>([]);
  const classes = useStyles();

  useEffect(() => {
    const items = notSelectedGroups.map((group) => {
      return (
        <MenuItem
          key={`select-group-${group.id}`}
          button
          disabled={props.loading}
          onClick={async () => {
            props.setLoading(true);
            try {
              unwrapResult(
                await dispatch(selectAndUpdateGroup({id: group.id})));
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
  }, [notSelectedGroups, props]);


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
