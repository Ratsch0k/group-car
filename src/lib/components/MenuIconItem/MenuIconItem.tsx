import React from 'react';
import {MenuItemProps, MenuItem, Theme} from '@material-ui/core';
import {MenuItemToSubMenu} from 'lib';
import {makeStyles, createStyles} from '@material-ui/styles';

/**
 * Props for the menu icon item element.
 */
export interface MenuIconItemProps extends MenuItemProps {
  /**
   * If this menu item should look like it opens a
   * sub menu. An arrow will be displayed on the right side.
   */
  opensSubMenu?: boolean;

  /**
   * The icon which should be displayed on the left.
   */
  icon?: JSX.Element;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      paddingLeft: theme.spacing(1),
    },
  }),
);

/**
 * Combines `MenuItem` and `MenuItemToSubMenu` and
 * provides option to append the menu item with
 * an icon.
 * @param props Props.
 */
export const MenuIconItem: React.FC<MenuIconItemProps> = (props) => {
  const {opensSubMenu, icon, children, ...rest} = props;
  const classes = useStyles();

  let Item;
  if (opensSubMenu) {
    Item = MenuItemToSubMenu;
  } else {
    Item = MenuItem;
  }

  return (
    <Item {...rest as unknown}>
      {icon}
      <span className={icon ? classes.text : undefined}>
        {children}
      </span>
    </Item>
  );
};

export default MenuIconItem;
