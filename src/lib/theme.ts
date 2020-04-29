import {createMuiTheme} from '@material-ui/core';

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
});

export default theme;
