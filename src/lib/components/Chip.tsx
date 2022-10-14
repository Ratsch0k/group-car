import {alpha, Chip as MUIChip} from '@material-ui/core';
import {createStyles, withStyles} from '@material-ui/styles';
import {GroupCarTheme} from 'lib/theme';

/**
 * Smaller variant of a chip.
 */
export const Chip = withStyles((theme: GroupCarTheme) => createStyles({
  sizeSmall: {
    height: 20,
    fontSize: '0.75rem',
  },
  colorPrimary: {
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.dark,
  },
  colorSecondary: {
    background: alpha(theme.palette.secondary.main, 0.1),
    color: theme.palette.secondary.dark,
  },
  deleteIconColorPrimary: {
    color: theme.palette.primary.dark,
  },
  deleteIconColorSecondary: {
    color: theme.palette.secondary.dark,
  },
  label: {
    fontWeight: 'bold',
  },
}))(MUIChip);

export default Chip;
