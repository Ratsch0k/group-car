import React, {useState} from 'react';
import {ThemeProvider} from '@material-ui/styles';
import HeaderBar from 'lib/components/HeaderBar/HeaderBar';
import {useEffect} from 'react';
import theme from 'lib/theme';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import Routes from 'lib/Routes';

type AxiosError = import('axios').AxiosError;

const GroupCar: React.FC = () => {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    axios('/api/test').then((res) => {
      setError(false);
      setData(JSON.stringify(res.data));
    }).catch((error: AxiosError) => {
      setError(true);
      setData(JSON.stringify(error.response!.data));
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HeaderBar />
      </div>
      <div style={{marginTop: '64px', color: error ? 'red' : 'black'}}>
        <NavLink to='/auth'>
            Authenticate
        </NavLink>
        {data}
        <Routes />
      </div>
    </ThemeProvider>
  );
};

export default GroupCar;
