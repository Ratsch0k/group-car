import {createTheme, Theme} from '@material-ui/core';
// IMPORTANT: Do not shorten import.
// Otherwise, index magic will break the axios mock during tests
import {themeProperties, IThemeOptions} from '../lib';


export default (width?: string): Theme => createTheme({
  ...themeProperties,
  props: {
    MuiButtonBase: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    MuiWithWidth: {initialWidth: width},
  },
} as IThemeOptions);
