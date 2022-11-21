import { Methods } from "./client";
import { Resource } from "./resource";

export class UserApi extends Resource {

  protected path = "/users";

  async getUsers() {
    return this.client.request({
      method: Methods.GET,
      path: this.path,
    });
  }

  async getUser(id: number) {
    return this.client.request({
      method: Methods.GET,
      path: `/users/${id}`,
    });
  }

  async createUser(user: any) {
    return this.client.request({
      method: Methods.POST,
      path: this.path,
      body: user,
    });
  }

  async updateUser(id: number, user: any) {
    return this.client.request({
      method: Methods.PUT,
      path: `${this.path}/${id}`,
      body: user,
    });
  }

  async deleteUser(id: number) {
    return this.client.request({
      method: Methods.DELETE,
      path: `${this.path}/${id}`,
    });
  }
}
