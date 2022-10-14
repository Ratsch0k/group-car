import {createTheme, Theme, ThemeOptions} from '@material-ui/core';
import {green, orange} from '@material-ui/core/colors';
import {Palette} from '@material-ui/core/styles/createPalette';
import {Shape} from '@material-ui/core/styles/shape';

export interface HeaderHeight {
  small: number;
  default: number;
}

export interface Sized<T> {
  default: T;
  small: T;
  large: T;
}

interface IShape extends Shape {
  headerHeight: HeaderHeight;
  drawerWidth: number;
  borderRadiusSized: Sized<number>
}

interface IPalette extends Palette {
  blur: string;
}


export interface IThemeOptions extends ThemeOptions {
  shape: Partial<IShape>;
  palette: Partial<IPalette>;
}


export interface GroupCarTheme extends Theme {
  shape: IShape;
  palette: IPalette;
}

export const themeProperties: IThemeOptions = {
  palette: {
    primary: {
      main: '#00C68A',
      light: '#8edcc0',
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
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    blur: 'blur(32px)',
    text: {
      primary: 'rgba(0, 0, 0, 0.75)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
  mixins: {
    toolbar: {
      'minHeight': 46,
      '@media(min-width: 600px)': {
        minHeight: 64,
      },
    },
  },
  shape: {
    headerHeight: {
      small: 48,
      default: 64,
    },
    drawerWidth: 350,
    borderRadius: 10,
    borderRadiusSized: {
      default: 12,
      large: 18,
      small: 8,
    },
  },
  /* eslint-disable max-len */
  shadows: [
    'none',
    '-1px 1px 4px rgba(171, 171, 171, 0.25), -1px 1px 4px rgba(171, 171, 171, 0.25)',
    '-1px 1px 4px rgba(171, 171, 171, 0.25), -1px 1px 4px rgba(171, 171, 171, 0.25)',
    '-1px 1px 4px rgba(171, 171, 171, 0.25), -1px 1px 4px rgba(171, 171, 171, 0.25)',
    '-1px 1px 4px rgba(171, 171, 171, 0.25), -1px 1px 4px rgba(171, 171, 171, 0.25)',
    '-1px 1px 4px rgba(171, 171, 171, 0.25), -1px 1px 4px rgba(171, 171, 171, 0.25)',
    '-1px 1px 4px rgba(171, 171, 171, 0.25), -1px 1px 4px rgba(171, 171, 171, 0.25)',
    '-1px 1px 4px rgba(171, 171, 171, 0.25), -1px 1px 4px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px 4px 16px rgba(171, 171, 171, 0.25), 1px 1px 16px rgba(171, 171, 171, 0.25)',
    '-4px -4px 32px rgba(145, 145, 145, 0.25), -8px 8px 32px rgba(145, 145, 145, 0.25)',
    '-4px -4px 32px rgba(145, 145, 145, 0.25), -8px 8px 32px rgba(145, 145, 145, 0.25)',
    '-4px -4px 32px rgba(145, 145, 145, 0.25), -8px 8px 32px rgba(145, 145, 145, 0.25)',
    '-4px -4px 32px rgba(145, 145, 145, 0.25), -8px 8px 32px rgba(145, 145, 145, 0.25)',
    '-4px -4px 32px rgba(145, 145, 145, 0.25), -8px 8px 32px rgba(145, 145, 145, 0.25)',
    '0px -4px 32px rgba(0, 0, 0, 0.25), -8px 20px 32px rgba(0, 0, 0, 0.25)',
  ],
};

export const theme = createTheme(themeProperties);
