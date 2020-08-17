import React, {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import GroupCar from './GroupCar';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/core';
import {
  theme,
  AuthProvider,
  ModalRouter,
} from 'lib';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const CsrfCancelToken = axios.CancelToken;
  const csrfSource = CsrfCancelToken.source();

  useEffect(() => {
    axios.head('/auth', {
      cancelToken: csrfSource.token,
    }).then((res) => {
      const csrf = res.headers['xsrf-token'];

      if (!csrf) {
        setLoading(false);
      } else {
        axios.defaults.headers.common['XSRF-TOKEN'] = csrf;
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    return () => {
      csrfSource.cancel('Request canceled');
    };
  });

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <ModalRouter>
              <GroupCar />
            </ModalRouter>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    );
  }
};

export default App;
