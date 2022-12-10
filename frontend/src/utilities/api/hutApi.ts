import { Hut, Point, Prisma } from "../../generated/prisma-client";
import { Methods } from "./client";
import { Resource } from "./resource";

export type HutWithPoint = Hut & { point: Point };
export class HutApi extends Resource {
  protected path = "/hut";

  async getHuts() {
    return this.client.request<HutWithPoint[]>({
      method: Methods.GET,
      path: this.path,
    });
  }

  async getHut(id: number) {
    return this.client.request<HutWithPoint>({
      method: Methods.GET,
      path: `${this.path}/${id}`,
    });
  }

  async createHut(hut: Partial<Hut>) {
    return this.client.request<Hut>({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: Methods.POST,
      path: this.path,
      body: hut,
    });
  }

  async updateHut(id: number, hut: Partial<Hut>) {
    return this.client.request<Hut>({
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
