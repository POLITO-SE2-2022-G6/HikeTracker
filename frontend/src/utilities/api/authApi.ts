import { User } from "../../generated/prisma-client";
import { Methods } from "./client";
import { Resource } from "./resource";

export class AuthApi extends Resource {
  protected path = "/sessions";

  async login(user: any) {
    return this.client.request<User>({
      method: Methods.POST,
      path: `${this.path}`,
      body: user,
    });
  }

  async check() {
    return this.client.request<User>({
      method: Methods.GET,
      path: `${this.path}/current`,
    });
  }

  async logout() {
    return this.client.request({
      method: Methods.DELETE,
      path: `${this.path}/logout`,
    });
  }

  async register(user: any) {
    return this.client.request({
      method: Methods.POST,
      path: `${this.path}/signup`,
      body: user,
    });
  }

}
