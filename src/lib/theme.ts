import {createMuiTheme} from '@material-ui/core';
import {green, orange} from '@material-ui/core/colors';

type Theme = import('@material-ui/core').Theme;
type ThemeOptions = import('@material-ui/core').ThemeOptions;
type Shape = import('@material-ui/core/styles/shape').Shape;

interface IShape extends Shape {
  headerHeight: number;
  drawerWidth: number;
}

interface IThemeOptions extends ThemeOptions {
  shape: Partial<IShape>;
}

export interface GroupCarTheme extends Theme {
  shape: IShape;
}

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00C68A',
      light: '#98F0D6',
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
    headerHeight: 64,
    drawerWidth: 350,
  },
} as IThemeOptions);
