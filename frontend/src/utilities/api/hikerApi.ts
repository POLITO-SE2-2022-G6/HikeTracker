import { Hike, Performance } from "../../generated/prisma-client";
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
    return this.client.request</*userHike[]*/any[]>({
      method: Methods.GET,
      path: `${this.path}/hikes`,
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
