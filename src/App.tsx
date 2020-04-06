import React from 'react';
import './App.css';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import HeaderBar from './HeaderBar';


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


const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HeaderBar />
      </div>
    </ThemeProvider>
  );
};

export default App;
