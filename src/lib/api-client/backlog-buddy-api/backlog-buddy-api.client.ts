import { ApiClientConfig } from "../api-client.type";
import { ApiClientBase } from "../api-client.base";
import { BacklogBuddyApiEndpoints } from "./backlog-buddy-api.endpoints";
import { HttpService } from "@nestjs/axios";

export class BacklogBuddyApiClient extends ApiClientBase {
  protected readonly endpoints: BacklogBuddyApiEndpoints;
  protected readonly httpService: HttpService;

  constructor() {
    const config: ApiClientConfig = {
      baseUrl: import.meta.env.VITE_API_URL,
    };
    super(config);
    this.endpoints = new BacklogBuddyApiEndpoints(config.baseUrl);
    this.httpService = new HttpService();
  }
  
  protected getAuthorizationToken(): string {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const authorizationToken = user.access_token;
    return `Bearer ${authorizationToken}`;
  }
}
