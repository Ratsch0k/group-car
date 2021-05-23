import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './i18n';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';
import config from 'config';
import history from './lib/redux/history';

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

ReactDOM.render(<App />, document.getElementById('root'));
