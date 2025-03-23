import { BacklogBuddyApiClient } from "../backlog-buddy-api.client";
import { AuthEndpoints } from "../backlog-buddy-api.endpoints";
import { SuccessResponse } from "./types/responses/success-response";
import { SignInRequest } from "./types/requests/sign-in.request";
import { SignInResponse } from "./types/responses/sign-in.response";
import { SignUpRequest } from "./types/requests/sign-up.request";
import { SignOutRequest } from "./types/requests/sign-out.request";
import { ConfirmResetPasswordRequest } from "./types/requests/confirm-reset-password.request";
import { ResetPasswordRequest } from "./types/requests/reset-passwrod.request";

export class BacklogBuddyAuthApiClient extends BacklogBuddyApiClient {
    private readonly authEndpoints: AuthEndpoints;

    constructor() {
    	super();
    	this.authEndpoints = this.endpoints.auth();
    }

	async signIn(options: SignInRequest): Promise<SignInResponse> {
		const endpoint = this.authEndpoints.signIn;
		const request = () => this.httpService.axiosRef.post(endpoint, options);

		return this.makeRequest<SignInResponse>(request, "signIn");
	}

	async signUp(options: SignUpRequest): Promise<SignInResponse> {
		const endpoint = this.authEndpoints.signUp;
		const request = () =>
			this.httpService.axiosRef.post(endpoint, options);

		return this.makeRequest<SignInResponse>(request, "signUp");
	}

	async signOut(options: SignOutRequest): Promise<SuccessResponse> {
		const endpoint = this.authEndpoints.signOut;
		const request = () => this.httpService.axiosRef.post(endpoint);

		return this.makeRequest<SuccessResponse>(request, "signOut");
	}

	async resetPassword(options: ResetPasswordRequest): Promise<SuccessResponse> {
		const endpoint = this.authEndpoints.resetPassword;
		const request = () => this.httpService.axiosRef.post(endpoint, options);

		return this.makeRequest<SuccessResponse>(request, "resetPassword");
	}

	async confirmResetPassword(options: ConfirmResetPasswordRequest, authorizationToken: string): Promise<SuccessResponse> {
		const endpoint = this.authEndpoints.confirmResetPassword;

		const headers = {
			Authorization: `Bearer ${authorizationToken}`,
		};

		const request = () =>
			this.httpService.axiosRef.post(endpoint, options, { headers });

		return this.makeRequest<SuccessResponse>(request, "confirmResetPassword");
	}

	async refreshSession(): Promise<SignInResponse> {
		const endpoint = this.authEndpoints.refreshSession;
		const user = JSON.parse(localStorage.getItem("user") || "{}");
    const refreshToken = user.refresh_token;
		const headers = {
			RefreshToken: refreshToken,
		};

		const request = () => this.httpService.axiosRef.post(endpoint, null, { headers });	

		return this.makeRequest<SignInResponse>(request, "refreshSession");
	}
}