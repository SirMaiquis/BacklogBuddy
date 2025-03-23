import { BacklogBuddyApiClient } from "../backlog-buddy-api.client";
import { LandingEndpoints } from "../backlog-buddy-api.endpoints";
import { LandingResponse } from "./types/landing-response";

export class BacklogBuddyLandingApiClient extends BacklogBuddyApiClient {
    private readonly landingEndpoints: LandingEndpoints;
  
    constructor() {
      super();
      this.landingEndpoints = this.endpoints.landing();
    }

    public getLandingData(): Promise<LandingResponse> {
				const headers = { 
					Authorization: this.getAuthorizationToken(),
				};
        
				const request = () => this.httpService.axiosRef.get(this.landingEndpoints.getLandingData, { headers });
				return this.makeRequest<LandingResponse>(request, "getLandingData");
    }
}