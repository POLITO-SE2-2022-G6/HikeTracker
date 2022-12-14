import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { AuthApi } from "./authApi";
import { HikeApi } from "./hikeApi";
import { HikerApi } from "./hikerApi";
import { HutApi } from "./hutApi";
import { PointApi } from "./pointApi";
import { UserApi } from "./userApi";

export interface Config {
  url: string;
  headers?: Record<string, string>;
  axios?: AxiosRequestConfig
}

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  INFO = "INFO",
  DELETE = "DELETE",
}


export interface APIRequest {
  method: Methods
  path: string
  body?: any
  params?: Record<string, string | number | null>,
  headers?: Record<string, string>
}

export class Client {
  config: Config;
  hike: HikeApi;
  user: UserApi;
  hut: HutApi;
  auth: AuthApi;
  point: PointApi;
  hiker: HikerApi;
  private ax: AxiosInstance
  constructor(config: Config) {
    this.config = config;
    this.auth = new AuthApi(this);
    this.hike = new HikeApi(this);
    this.user = new UserApi(this);
    this.hut = new HutApi(this);
    this.point = new PointApi(this);
    this.hiker = new HikerApi(this);
    this.ax = axios.create(config.axios);
  }

  async request<T>({ method, path, body, params, headers }: APIRequest) {
    return this.ax.request<T>({
      method,
      baseURL: this.config.url,
      url: path,
      data: body,
      params,
      responseType: "json",
      headers: headers
    })
      .then(res => res.data)
      .catch(err => {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data) {
            throw err.response.data;
          }
          throw new Error(err.message);
        }
      })

  }
}
