import {createTheme} from '@material-ui/core';
import {green, orange} from '@material-ui/core/colors';

type Theme = import('@material-ui/core').Theme;
type ThemeOptions = import('@material-ui/core').ThemeOptions;
type Shape = import('@material-ui/core/styles/shape').Shape;

export interface HeaderHeight {
  small: number;
  default: number;
}

interface IShape extends Shape {
  headerHeight: HeaderHeight;
  drawerWidth: number;
}

export interface IThemeOptions extends ThemeOptions {
  shape: Partial<IShape>;
}

export interface GroupCarTheme extends Theme {
  shape: IShape;
}

export const themeProperties: IThemeOptions = {
  palette: {
    primary: {
      main: '#00C68A',
      light: '#bfecdb',
      dark: '#00A473',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#AD00D8',
      light: '#ECA1FF',
      dark: '#8900AB',
      contrastText: '#FFFFFF',
    },
    success: {
      main: green['500'],
      light: green['300'],
      dark: green['800'],
      contrastText: '#FFFFFF',
    },
    warning: {
      main: orange['500'],
      light: orange['300'],
      dark: orange['800'],
      contrastText: '#FFFFFF',
    },
  },
  shape: {
    headerHeight: {
      small: 48,
      default: 64,
    },
    drawerWidth: 350,
  },
};

export const theme = createTheme(themeProperties);
