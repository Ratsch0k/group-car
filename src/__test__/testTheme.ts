import {createTheme} from '@material-ui/core';
// IMPORTANT: Do not shorten import.
// Otherwise, index magic will break the axios mock during tests
import {themeProperties, IThemeOptions} from '../lib/theme';


export default (width?: string) => createTheme({
  ...themeProperties,
  props: {
    MuiButtonBase: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    MuiWithWidth: {initialWidth: width},
  },
} as IThemeOptions);
