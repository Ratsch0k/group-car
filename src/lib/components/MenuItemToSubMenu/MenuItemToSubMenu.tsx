import React from 'react';
import {
  MenuItemProps,
  MenuItem,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrowIcon: {
      fontSize: '1rem',
      position: 'absolute',
      right: theme.spacing(2),
    },
  }),
);

/**
 * Variant of the `MenuItem` which will add an arrow icon to the end of
 * the menu item to symbolize that this menu item will open an
 * a sub menu.
 * @param props Same as for `MenuItems`
 */
export const MenuItemToSubMenu: React.FC<MenuItemProps> = (props) => {
  const {children, ...rest} = props;

  const classes = useStyles();

  return (
    <MenuItem {...rest as unknown}>
      {children}
      <ArrowForwardIosIcon
        color='inherit'
        className={classes.arrowIcon}
      />
    </MenuItem>
  );
};

export default MenuItemToSubMenu;
