import React, {useState} from 'react';
import './App.css';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import HeaderBar from './lib/HeaderBar/HeaderBar';
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
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/test').then((res) => {
      if (res.status >= 400) {
        setError(true);
      }
      return res.text();
    }).then((res) => {
      // Parse status message
      setData(res);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HeaderBar />
      </div>
      <div style={{marginTop: '64px', color: error ? 'red' : 'black'}}>
        {data}
      </div>
    </ThemeProvider>
  );
};

export default App;
