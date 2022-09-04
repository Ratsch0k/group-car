import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './i18n';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';
import config from 'config';
import history from './lib/redux/history';
import App from './App';

/**
 * Initialise sentry
 */
Sentry.init({
  dsn: config.sentry.dsn,
  integrations: [new Integrations.BrowserTracing({
    routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
  })],
  tracesSampleRate: config.sentry.tracesSampleRate,
  normalizeDepth: config.sentry.normalizeDepth,
});

/**
 * Set up icons for leaflet
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

if (process.env.REACT_APP_DEMO_MODE) {
  // Split demo code from main bundle to reduce its size
  const DemoApp = React.lazy(() => import('./DemoApp'));

  ReactDOM.render(
    <Suspense fallback={null}>
      <DemoApp />
    </Suspense>,
    document.getElementById('root'),
  );
} else {
  ReactDOM.render(
    <Suspense fallback={null}>
      <App/>
    </Suspense>,
    document.getElementById('root'),
  );
}

