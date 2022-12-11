import { Methods } from "./client";
import { Resource } from "./resource";
import { Performance } from "../../generated/prisma-client";

export class HikerApi extends Resource {
  protected path = "/hiker";

  async getPerformance() {
    return this.client.request({
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

  async getProfile() {
    // TODO: implement
  }

  async getRecommendedHikes() {
    return this.client.request({
      method: Methods.GET,
      path: `${this.path}/hikesByPerf`,
    });
  }
}
