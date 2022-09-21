import {withStyles} from '@material-ui/core';
import AlertMui from '@material-ui/lab/Alert';

/**
 * Styled Alert.
 */
export const Alert = withStyles({
  root: {
    boxShadow: '-4px 4px 16px 0px rgba(171, 171, 171, 0.25),' +
    '1px 1px 16px 0px rgba(171, 171, 171, 0.25)',
  },
})(AlertMui);

export default Alert;
