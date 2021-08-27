import {createTheme} from '@material-ui/core';
import {themeProperties, IThemeOptions} from '../lib/theme';

export default createTheme({
  ...themeProperties,
  props: {
    MuiButtonBase: {
      disableTouchRipple: true,
      disableRipple: true,
    },
  },
} as IThemeOptions);
