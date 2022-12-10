import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type SpotifyTokenResponse = {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,         
  scope: string
} & AxiosRequestConfig & AxiosResponse;