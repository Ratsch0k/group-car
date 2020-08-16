export interface CsrfConfig {
  token: string;
}

export interface Config {
  csrf: CsrfConfig;
}

const config: Config = {
  csrf: {
    token: '',
  },
};

export default config;
