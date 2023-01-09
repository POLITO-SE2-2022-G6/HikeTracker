import { Hut, ParkingLot, Point } from "../../generated/prisma-client";
import { Methods } from "./client";
import { Resource } from "./resource";

type AddPoint = Partial<Point> & {
  hut?: Partial<Hut>;
  parkingLot?: Partial<ParkingLot>;
  image?: File
};

export class PointApi extends Resource {
  protected path = "/point";

  async getPoints() {
    return this.client.request<Point[]>({
      method: Methods.GET,
      path: this.path,
      body: {
        Hut: {},
        ParkingLot: {}
      }
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
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: Methods.POST,
      path: this.path,
      body: { ...point, hut: JSON.stringify(point.hut || undefined), parkinglot: JSON.stringify(point.parkingLot || undefined)},
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
