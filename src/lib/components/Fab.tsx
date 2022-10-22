import {alpha, createStyles, Fab as MUIFab} from '@material-ui/core';
import {GroupCarTheme} from 'lib/theme';
import {withStyles} from '@material-ui/styles';

export const Fab = withStyles((theme: GroupCarTheme) => createStyles({
  root: {
    borderRadius: theme.shape.borderRadiusSized.large,
  },
  colorPrimary: {
    boxShadow: `0px 4px 12px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}))(MUIFab);

export default Fab;
