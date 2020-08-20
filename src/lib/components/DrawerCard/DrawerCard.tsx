import {Paper, PaperProps} from '@material-ui/core';
import React from 'react';

/**
 * Variation of {@link Paper} which is used for cards in the drawer.
 * @param props Same props as {@link Paper}
 */
export const DrawerCard: React.FC<PaperProps> = (props) => {
  const {children, ...rest} = props;

  return (
    <Paper
      square
      elevation={6}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default DrawerCard;
