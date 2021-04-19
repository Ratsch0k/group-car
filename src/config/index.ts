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

export interface Config {
  csrf: CsrfConfig;
  group: GroupConfig;
  invites: InvitesConfig;
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
};

export default config;
