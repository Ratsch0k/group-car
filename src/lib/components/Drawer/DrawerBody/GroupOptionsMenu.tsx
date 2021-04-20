import React, {useState, useRef, Dispatch, SetStateAction} from 'react';
import {
  MenuList,
  Paper,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import {GroupCarTheme} from 'lib';
import {useTranslation} from 'react-i18next';
import GroupSelectionMenu from './GroupSelectionMenu';
import AddIcon from '@material-ui/icons/Add';
import MenuIconItem from 'lib/components/MenuIconItem';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/List';
import {useAppDispatch, useShallowAppSelector} from 'lib/redux/hooks';
import {goToModal} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {getAllGroups, getSelectedGroup} from 'lib/redux/slices/group';

/**
 * Props for the group options menu.
 */
export interface GroupOptionsMenuProps {
  /**
   * Callback to close the menu.
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
 * Options menu for the group button in the drawer.
 * @param props   Props.
 */
export const GroupOptionsMenu: React.FC<GroupOptionsMenuProps>=
(props: GroupOptionsMenuProps) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const selectedGroup = useShallowAppSelector(getSelectedGroup);
  const groups = useShallowAppSelector(getAllGroups);
  const [openSubMenu, setOpenSubMenu] =
    useState<boolean>(false);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const groupSelectionMenuRef = useRef<HTMLDivElement>(null);

  const useStyles = makeStyles((theme: GroupCarTheme) =>
    createStyles({
      paper: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        height: openSubMenu ?
          groupSelectionMenuRef.current?.scrollHeight :
          mainMenuRef.current?.scrollHeight,
        transition: 'height 250ms ease-out',
      },
      subMenu: {
        height: openSubMenu ? 'auto' : 0,
        opacity: openSubMenu ? 1 : 0,
        visibility: openSubMenu ? undefined : 'hidden',
      },
      mainMenu: {
        height: openSubMenu ? 0 : 'auto',
        opacity: openSubMenu ? 0 : 1,
        visibility: openSubMenu ? 'hidden' : undefined,
      },
      menuItemText: {
        paddingLeft: theme.spacing(1),
      },
    }),
  );

  const classes = useStyles();

  return (
    <Paper
      classes={{root: classes.paper}}
      elevation={8}
    >

      <div
        ref={groupSelectionMenuRef}
        className={classes.subMenu}
      >
        <GroupSelectionMenu
          goBack={() => setOpenSubMenu(false)}
          close={props.close}
          loading={props.loading}
          setLoading={props.setLoading}
        />
      </div>
      <div
        ref={mainMenuRef}
        className={classes.mainMenu}
      >
        <MenuList>
          <MenuIconItem
            onClick={() => dispatch(goToModal('/group/create'))}
            icon={<AddIcon />}
            disabled={props.loading}
            button
          >
            {t('drawer.groupMenu.item.create')}
          </MenuIconItem>
          {
            selectedGroup !== null &&
            <MenuIconItem
              onClick={
                () => dispatch(goToModal(`/group/manage/${selectedGroup.id}`))
              }
              icon={<EditIcon />}
              disabled={props.loading}
              button
            >
              {t('drawer.groupMenu.item.manage')}
            </MenuIconItem>
          }
          {
            (
              groups.length > 1 ||
              (
                groups.length === 1 && selectedGroup === null
              )
            ) &&
            <MenuIconItem
              onClick={() => setOpenSubMenu(true)}
              opensSubMenu
              icon={<ListIcon />}
              disabled={props.loading}
              button
            >
              {t('drawer.groupMenu.item.select')}
            </MenuIconItem>
          }
        </MenuList>
      </div>
    </Paper>
  );
};

export default GroupOptionsMenu;
