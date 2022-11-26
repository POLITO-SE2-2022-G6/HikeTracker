import { Client } from "./client";

export class Resource {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
