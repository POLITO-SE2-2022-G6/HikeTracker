import { Hike, Hut, Point } from "../../generated/prisma-client";
import { Client, Methods } from "./client";
import { Resource } from "./resource";

export type withPoint<T> = T & {
  point: Point;
};

export type fullHike = Hike & {
  start_point: Point
  end_point: Point
  reference_points: Point[]
  huts: withPoint<Hut>[]
}
export class HikeApi extends Resource {

  protected path = "hike";

  async getHikes() {
    return this.client.request<Hike[]>({
      method: Methods.GET,
      path: this.path,
    });
  }

  async getHike(id: number) {
    return this.client.request<fullHike>({
      method: Methods.GET,
      path: `${this.path}/${id}`,
    });
  }

  async createHike(hike: any) {
    return this.client.request<Hike>({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: Methods.POST,
      path: this.path,
      body: hike,
    });
  }

  async updateHike(id: number, hike: any) {
    return this.client.request<Hike>({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
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
