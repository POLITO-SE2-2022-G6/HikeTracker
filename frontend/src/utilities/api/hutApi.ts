import { Methods } from "./client";
import { Resource } from "./resource";

export class HutApi extends Resource {
  protected path = "/huts";

  async getHuts() {
    return this.client.request({
      method: Methods.GET,
      path: this.path,
    });
  }

  async getHut(id: number) {
    return this.client.request({
      method: Methods.GET,
      path: `${this.path}/${id}`,
    });
  }

  async createHut(hut: any) {
    return this.client.request({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: Methods.POST,
      path: this.path,
      body: hut,
    });
  }

  async updateHut(id: number, hut: any) {
    return this.client.request({
      method: Methods.PUT,
      path: `${this.path}/${id}`,
      body: hut,
    });
  }

  async deleteHut(id: number) {
    return this.client.request({
      method: Methods.DELETE,
      path: `${this.path}/${id}`,
    });
  }
}
