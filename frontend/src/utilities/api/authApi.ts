import { Methods } from "./client";
import { Resource } from "./resource";

export class AuthApi extends Resource {
  protected path = "/auth";

  async login(user: any) {
    return this.client.request({
      method: Methods.POST,
      path: `${this.path}/login`,
      body: user,
    });
  }

  async check() {
    return this.client.request({
      method: Methods.GET,
      path: `${this.path}/current`,
    });
  }

  async logout() {
    return this.client.request({
      method: Methods.POST,
      path: `${this.path}/logout`,
    });
  }

  async register(user: any) {
    return this.client.request({
      method: Methods.POST,
      path: `${this.path}/register`,
      body: user,
    });
  }

}
