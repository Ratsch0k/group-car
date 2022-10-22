import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import {GroupCarTheme} from 'lib';
import React from 'react';

export interface SettingsTabTitleProps {
  actions?: JSX.Element;
}

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: 'bold',
  },
  titleItem: {
    flex: '1 1 auto',
  },
}));

export const SettingsTabTitle: React.FC<SettingsTabTitleProps> = (props) => {
  const classes = useStyles();
  const {children, actions} = props;
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  return (
    <Grid
      container
      alignItems='center'
      className={mdUp ? classes.root : undefined}
    >
      <Grid item className={classes.titleItem}>
        <Typography
          variant={mdUp ? 'h5' : 'h6'}
          className={classes.title}
        >
          <b>
            {children}
          </b>
        </Typography>
      </Grid>
      <Grid item>
        {actions}
      </Grid>
    </Grid>
  );
};

export default SettingsTabTitle;
