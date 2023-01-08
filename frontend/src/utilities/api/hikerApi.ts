import { Hike, Performance, UserHikes } from "../../generated/prisma-client";
import { Methods } from "./client";
import { Resource } from "./resource";

export class HikerApi extends Resource {
  protected path = "/hiker";

  async getPerformance() {
    return this.client.request<Performance>({
      method: Methods.GET,
      path: `${this.path}/performance`,
    });
  }

  async editPerformance(performance: Partial<Performance>) {
    return this.client.request({
      method: Methods.PUT,
      path: `${this.path}/performance`,
      body: performance,
    });
  }

  async getActivities() {
    return this.client.request<UserHikes[]>({
      method: Methods.GET,
      path: `${this.path}/hikes`,
    });
  }

  async getActivity(id: number) {
    return this.client.request<UserHikes[]>({
      method: Methods.GET,
      path: `${this.path}/hike/${id}`,
    });
  }

  async startActivity(hikeId: string, refPointId: number) {
    return this.client.request({
      headers: {
      'Content-Type': 'multipart/form-data'
      },
      method: Methods.POST,
      path: `${this.path}/hike/${hikeId}`,
      body: {
        refPointId: JSON.stringify(refPointId)
      }
    });
  }

  async updateActivity(hikeId: string, refPointId: number, status: string) {
    return this.client.request({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: Methods.PUT,
      path: `${this.path}/hike/${hikeId}`,
      body: {
        refPointId: JSON.stringify(refPointId),
        status : JSON.stringify(refPointId)
      }
    });
  }

  async getProfile() {
    // TODO: implement
  }

  async getRecommendedHikes() {
    return this.client.request<Hike[]>({
      method: Methods.GET,
      path: `${this.path}/hikesByPerf`,
    });
  }
}
