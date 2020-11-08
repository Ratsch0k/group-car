export interface CsrfConfig {
  token: string;
}

export interface GroupConfig {
  maxCars: number;
  maxMembers: number;
}

export interface Config {
  csrf: CsrfConfig;
  group: GroupConfig;
}

const config: Config = {
  csrf: {
    token: '',
  },
  group: {
    maxCars: 8,
    maxMembers: 25,
  },
};

export default config;
