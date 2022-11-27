import { Hut, ParkingLot, Point } from "../../generated/prisma-client";
import { Methods } from "./client";
import { Resource } from "./resource";

type AddPoint = Partial<Point> & {
  Hut?: Partial<Hut>;
  ParkingLot?: Partial<ParkingLot>;
};

export class PointApi extends Resource {
  protected path = "/point";

  async getPoints() {
    return this.client.request<Point[]>({
      method: Methods.GET,
      path: this.path,
    });
  }

  async getPoint(id: number) {
    return this.client.request<Point>({
      method: Methods.GET,
      path: `${this.path}/${id}`,
    });
  }

  async createPoint(point: AddPoint) {
    return this.client.request<Point>({
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      method: Methods.POST,
      path: this.path,
      body: point,
    });
  }

  async updatePoint(id: number, point: AddPoint) {
    return this.client.request({
      method: Methods.PUT,
      path: `${this.path}/${id}`,
      body: point,
    });
  }

  async deletePoint(id: number) {
    return this.client.request({
      method: Methods.DELETE,
      path: `${this.path}/${id}`,
    });
  }
}
