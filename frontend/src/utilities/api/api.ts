import { Client } from "./client";

export const API = new Client({
  url: "http://localhost:3000/api",
  headers: {},
  axios: {
    withCredentials: true
  }
});
