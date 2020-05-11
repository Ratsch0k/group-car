import React, {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import GroupCar from './GroupCar';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './lib/context/auth/authContext';
import {ThemeProvider} from '@material-ui/core';
import theme from 'lib/theme';
import AuthRedirect from 'lib/components/ModalRouteHandler/AuthRedirect';
import AuthDialogCheck from 'lib/components/ModalRouteHandler/AuthDialogCheck';

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

      } else {
        axios.defaults.headers.common['XSRF-TOKEN'] = csrf;
        setLoading(false);
      }
    }).catch((error) => {
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
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <AuthRedirect>
              <AuthDialogCheck>
                <GroupCar />
              </AuthDialogCheck>
            </AuthRedirect>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
};

export default App;
