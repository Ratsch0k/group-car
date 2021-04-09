import {createMuiTheme} from '@material-ui/core';
import {themeProperties, IThemeOptions} from '../lib/theme';

export default createMuiTheme({
  ...themeProperties,
  props: {
    MuiButtonBase: {
      disableTouchRipple: true,
      disableRipple: true,
    },
  },
} as IThemeOptions);
