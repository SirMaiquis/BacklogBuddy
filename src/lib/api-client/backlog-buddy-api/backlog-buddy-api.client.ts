import { ApiClientConfig } from "../api-client.type";
import { ApiClientBase } from "../api-client.base";
import { BacklogBuddyApiEndpoints } from "./backlog-buddy-api.endpoints";
import { HttpService } from "@nestjs/axios";
import { SignInResponse } from "./types/auth/responses/sign-in.response";
import { SignInRequest } from "./backlog-buddy-api.types";
import { SignOutRequest } from "./types/auth/requests/sign-out.request";
import { ResetPasswordRequest } from "./types/auth/requests/reset-passwrod.request";
import { SuccessResponse } from "./types/auth/responses/success-response";
import { SignUpRequest } from "./types/auth/requests/sign-up.request";
import { ConfirmResetPasswordRequest } from "./types/auth/requests/confirm-reset-password.request";
import { GameResponse } from "./types/games/responses/games.response";
import { GameDetailsResponse } from "./types/games/responses/game-details.response";
import { GameDetailsRequest } from "./types/games/requests/game-details.request";
import { GameSearchResponse } from "./types/games/responses/game-search.response";
import { GameSearchRequest } from "./types/games/requests/game-search.request";

export class BacklogBuddyApiClient extends ApiClientBase {
  private readonly endpoints: BacklogBuddyApiEndpoints;
  private readonly httpService: HttpService;

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

  async signUp(options: SignUpRequest): Promise<SignInResponse> {
    const endpoint = this.endpoints.auth().signUp;
    const request = () =>
      this.httpService.axiosRef.post(endpoint, options);

    return this.makeRequest<SignInResponse>(request, "signUp");
  }

  async signOut(options: SignOutRequest): Promise<SuccessResponse> {
    const endpoint = this.endpoints.auth().signOut;
    const request = () => this.httpService.axiosRef.post(endpoint);

    return this.makeRequest<SuccessResponse>(request, "signOut");
  }

  async resetPassword(options: ResetPasswordRequest): Promise<SuccessResponse> {
    const endpoint = this.endpoints.auth().resetPassword;
    const request = () => this.httpService.axiosRef.post(endpoint, options);

    return this.makeRequest<SuccessResponse>(request, "resetPassword");
  }

  async confirmResetPassword(options: ConfirmResetPasswordRequest, authorizationToken: string): Promise<SuccessResponse> {
    const endpoint = this.endpoints.auth().confirmResetPassword;

    const headers = {
      Authorization: `Bearer ${authorizationToken}`,
    };

    const request = () =>
      this.httpService.axiosRef.post(endpoint, options, { headers });

    return this.makeRequest<SuccessResponse>(request, "confirmResetPassword");
  }

  async getGames(): Promise<GameResponse[]> {
    const authorizationToken = this.getAuthorizationToken();

    const endpoint = this.endpoints.games().getAll;
    const headers = {
      Authorization: authorizationToken,
    };
    const request = () => this.httpService.axiosRef.get(endpoint, { headers });

    return this.makeRequest<GameResponse[]>(request, "getGames");
  }

  async getGameDetails(options: GameDetailsRequest): Promise<GameDetailsResponse> {
    const authorizationToken = this.getAuthorizationToken();

    const endpoint = this.endpoints.games().getDetails(options.id);
    const headers = {
      Authorization: authorizationToken,
    };

    const request = () =>
      this.httpService.axiosRef.get(endpoint, { headers });

    return this.makeRequest<GameDetailsResponse>(request, "getGameDetails");
  } 

  async searchGames(options: GameSearchRequest): Promise<GameSearchResponse[]> {
    const authorizationToken = this.getAuthorizationToken();

    const endpoint = this.endpoints.games().search;
    const queryParams = {
      name: options.name,
    };
    const headers = { 
      Authorization: authorizationToken,
    };

    const request = () =>
      this.httpService.axiosRef.get(endpoint, { headers, params: queryParams });

    return this.makeRequest<GameSearchResponse[]>(request, "searchGames");
  }
  
  getAuthorizationToken(): string {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const authorizationToken = user.access_token;
    return `Bearer ${authorizationToken}`;
  }
}
