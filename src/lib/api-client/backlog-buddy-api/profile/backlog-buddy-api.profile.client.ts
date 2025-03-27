import { BacklogBuddyApiClient } from "../backlog-buddy-api.client";
import { ProfileEndpoints } from "../backlog-buddy-api.endpoints";
import { GetProfileDataResponse } from "./types/responses/get-profile-data.response";
import { InitLinkResponse } from "./types/responses/init-link.response";
import { SuccessResponse } from "../auth/types/responses/success-response";   
import { UpdateProfileDataRequest } from "./types/requests/update-profile-data.request";

export class BacklogBuddyProfileApiClient extends BacklogBuddyApiClient {
    private readonly profileEndpoints: ProfileEndpoints;
  
    constructor() {
      super();
      this.profileEndpoints = this.endpoints.profile();
    }

    public getProfile(): Promise<GetProfileDataResponse> {
				const headers = { 
					Authorization: this.getAuthorizationToken(),
				};
        
				const request = () => this.httpService.axiosRef.get(this.profileEndpoints.getProfileData, { headers });
				return this.makeRequest<GetProfileDataResponse>(request, "getProfile");
    }

	public updateProfile(options: UpdateProfileDataRequest): Promise<SuccessResponse> {
		const headers = {
			Authorization: this.getAuthorizationToken(),
		};

		const request = () => this.httpService.axiosRef.put(this.profileEndpoints.updateProfile, options, { headers });
		return this.makeRequest<SuccessResponse>(request, "updateProfile");
	}

    public initLink(provider: string): Promise<InitLinkResponse> {
				const headers = { 
					Authorization: this.getAuthorizationToken(),
				};

				const request = () => this.httpService.axiosRef.get(this.profileEndpoints.initLink(provider), { headers });
				return this.makeRequest<InitLinkResponse>(request, "initLink");
    }

    public confirmLinking(provider: string, metadata: string): Promise<SuccessResponse> {
				const headers = { 
					Authorization: this.getAuthorizationToken(),
				};
				const request = () => this.httpService.axiosRef.post(this.profileEndpoints.confirmLink(provider, metadata), null, { headers });
				return this.makeRequest<SuccessResponse>(request, "confirmLinking");
    }

    public unlink(provider: string): Promise<SuccessResponse> {
				const headers = { 
					Authorization: this.getAuthorizationToken(),
				};

				const request = () => this.httpService.axiosRef.delete(this.profileEndpoints.unlink(provider), { headers });
				return this.makeRequest<SuccessResponse>(request, "unlink");
    }
}