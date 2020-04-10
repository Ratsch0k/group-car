import React, { useState } from 'react';
import './App.css';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import HeaderBar from './HeaderBar';
import {useEffect} from 'react';


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
  const [data, setData] = useState<string>('');

  useEffect(() => {
    fetch('/api/test').then((res) => {
      return res.text();
    }).then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HeaderBar />
      </div>
      <div style={{marginTop: '64px'}}>
        {data}
      </div>
    </ThemeProvider>
  );
};

export default App;
