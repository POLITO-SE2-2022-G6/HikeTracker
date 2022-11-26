import { Client, Methods } from "./client";
import { Resource } from "./resource";

export class HikeApi extends Resource {

  protected path = "/hike";

  async getHikes() {
    return this.client.request({
      method: Methods.GET,
      path: this.path,
    });
  }

  async getHike(id: number) {
    return this.client.request({
      method: Methods.GET,
      path: `${this.path}/${id}`,
    });
  }

  async createHike(hike: any) {
    return this.client.request({
      method: Methods.POST,
      path: this.path,
      body: hike,
    });
  }

  async updateHike(id: number, hike: any) {
    return this.client.request({
      method: Methods.PUT,
      path: `${this.path}/${id}`,
      body: hike,
    });
  }

  async deleteHike(id: number) {
    return this.client.request({
      method: Methods.DELETE,
      path: `${this.path}/${id}`,
    });
  }
}
