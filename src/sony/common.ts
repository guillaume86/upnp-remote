export interface TV {
  ip: string;
  location: {
    IRCC: string;
  };
}

export const AUTH_HEADERS = { "X-Auth-PSK": "1111" };
