export interface CsrfConfig {
  token: string;
}

export interface GroupConfig {
  maxCars: number;
  maxMembers: number;
}

export interface InvitesConfig {
  checkInterval: number;
}

export interface SentryConfig {
  normalizeDepth: number;
  dsn: string;
  tracesSampleRate: number;
}

export interface Config {
  csrf: CsrfConfig;
  group: GroupConfig;
  invites: InvitesConfig;
  sentry: SentryConfig;
  frontend: string;
}

const config: Config = {
  csrf: {
    token: '',
  },
  group: {
    maxCars: 8,
    maxMembers: 25,
  },
  invites: {
    checkInterval: 10000, // 10 seconds
  },
  sentry: {
    normalizeDepth: 10,
    dsn: process.env.SENTRY_DSN || 'https://46304bd186a44341a70545d48b23647b@o656739.ingest.sentry.io/5762871',
    tracesSampleRate: 1.0,
  },
  frontend: '0.10.0-beta.0',
};

export default config;
