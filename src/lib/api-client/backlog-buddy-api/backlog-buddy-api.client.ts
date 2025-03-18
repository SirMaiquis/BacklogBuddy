import { ApiClientConfig } from "../api-client.type";
import { ApiClientBase } from "../api-client.base";
import { BacklogBuddyApiEndpoints } from "./backlog-buddy-api.endpoints";
import { HttpService } from "@nestjs/axios";
import { SignInResponse } from "./types/auth/responses/sign-in.response";
import { SignInRequest } from "./backlog-buddy-api.types";
import { SignOutRequest } from "./types/auth/requests/sign-out.request";
import { SignOutResponse } from "./types/auth/responses/sign-out.response";

export class BacklogBuddyApiClient extends ApiClientBase {
  private readonly endpoints;
  private readonly httpService;

  constructor() {
    const config: ApiClientConfig = {
      baseUrl: import.meta.env.VITE_API_URL,
    };
    super(config);
    this.endpoints = new BacklogBuddyApiEndpoints(config.baseUrl);
    this.httpService = new HttpService();
  }

  async signIn(options: SignInRequest): Promise<SignInResponse> {
    const endpoint = this.endpoints.auth().signIn;
    const request = () => this.httpService.axiosRef.post(endpoint, options);

    return this.makeRequest<SignInResponse>(request, "signIn");
  }

  async signUp(email: string, password: string) {
    const endpoint = this.endpoints.auth().signUp;
    const request = () =>
      this.httpService.axiosRef.post(endpoint, { email, password });

    return this.makeRequest(request, "signUp");
  }

  async signOut(options: SignOutRequest): Promise<SignOutResponse> {
    const endpoint = this.endpoints.auth().signOut;
    const request = () => this.httpService.axiosRef.post(endpoint);

    return this.makeRequest<SignOutResponse>(request, "signOut");
  }

  async resetPassword(email: string) {
    const endpoint = this.endpoints.auth().resetPassword;
    const request = () => this.httpService.axiosRef.post(endpoint, { email });

    return this.makeRequest(request, "resetPassword");
  }
}
