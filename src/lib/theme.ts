import {createMuiTheme} from '@material-ui/core';

type Theme = import('@material-ui/core').Theme;
type ThemeOptions = import('@material-ui/core').ThemeOptions;
type Shape = import('@material-ui/core/styles/shape').Shape;

interface IShape extends Shape {
  headerHeight: number;
}

interface IThemeOptions extends ThemeOptions {
  shape: Partial<IShape>;
}

export interface GroupCarTheme extends Theme {
  shape: IShape;
}

const theme = createMuiTheme({
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
  },
  shape: {
    headerHeight: 64,
  },
} as IThemeOptions);

export default theme;
