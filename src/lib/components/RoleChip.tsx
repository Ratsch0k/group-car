import {Chip} from '@material-ui/core';
import {withStyles} from '@material-ui/styles';

/**
 * Smaller variant of a chip.
 */
export const RoleChip = withStyles({
  sizeSmall: {
    height: 20,
    fontSize: '0.75rem',
  },
})(Chip);

export default RoleChip;
