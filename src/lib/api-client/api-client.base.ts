import { ApiClientConfig } from "./api-client.type";
import { AxiosError, AxiosResponse } from "axios";
import { getReasonPhrase } from "http-status-codes";

export class ApiClientBase {
  protected baseUrl: string;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
  }

  protected async makeRequest<T>(
    request: () => Promise<AxiosResponse<T>>,
    method: string
  ): Promise<T> {
    console.log(`Requesting from method ${method}`);
    try {
      const response = await request();
      const { data } = response;

      return data as T;
    } catch (error: unknown) {
      this.logErrorDetails(error as Error, method);
      throw error;
    }
  }

  private logErrorDetails(error: Error, method: string): void {
    console.error(`fail method: ${method}`);
    console.error(`fail with message: ${error?.message}`);
    if (error instanceof AxiosError) this.logErrorResponse(error);
  }

  private logErrorResponse(error: AxiosError) {
    const { response } = error;
    if (response) {
      const { status } = response;
      const logStatus = status ? this.statusCodesMessage(status) : null;
      console.error(`${logStatus} and response:`, error.response?.data);
    }
  }

  private statusCodesMessage(statusCode: number): string {
    const reasonPhrase = getReasonPhrase(statusCode);
    return `fail with status: "${statusCode}: ${reasonPhrase}"`;
  }
}
