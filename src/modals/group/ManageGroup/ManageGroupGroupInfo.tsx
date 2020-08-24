import React from 'react';
import {GroupWithOwner, GroupCarTheme} from 'lib';
import {Typography, Box} from '@material-ui/core';
import {makeStyles, createStyles} from '@material-ui/styles';
import clsx from 'clsx';

export interface ManageGroupOverviewInfoProps {
  group: GroupWithOwner;
}

/**
 * The maximum lines for the description.
 */
const maxLines = 5;

/**
 * Styles.
 */
const useStyles = makeStyles((theme: GroupCarTheme) =>
  createStyles({
    text: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
    },
    description: {
      maxHeight: `calc(${maxLines} *
        ${theme.typography.body1.fontSize} *
        ${theme.typography.body1.lineHeight})`,
    },
  }),
);

/**
 * Shows name and description of the specified group.
 */
export const ManageGroupOverviewInfo: React.FC<ManageGroupOverviewInfoProps> =
(props: ManageGroupOverviewInfoProps) => {
  const {group} = props;
  const classes = useStyles();

  return (
    <Box>
      <Typography
        variant='h5'
        className={classes.text}
        gutterBottom
      >
        <span dangerouslySetInnerHTML={{__html: group.name}} />
      </Typography>
      <Typography
        variant='body1'
        className={clsx(classes.text, classes.description)}
        color='textSecondary'
        gutterBottom
      >
        <span dangerouslySetInnerHTML={{__html: group.description}} />
      </Typography>
    </Box>
  );
};

export default ManageGroupOverviewInfo;
