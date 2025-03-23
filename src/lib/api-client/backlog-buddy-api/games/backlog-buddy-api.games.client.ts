import { SuccessResponse } from "../auth/types/responses/success-response";
import { BacklogBuddyApiClient } from "../backlog-buddy-api.client";
import { GamesEndpoints } from "../backlog-buddy-api.endpoints";
import { GameCreateRequest } from "./types/requests/game-create.request";
import { GameDetailsRequest } from "./types/requests/game-details.request";
import { GameNoteCreateRequest } from "./types/requests/game-note-create.request";
import { GameNoteDeleteRequest } from "./types/requests/game-note-delete.request";
import { GameNoteUpdateRequest } from "./types/requests/game-notes-update.request";
import { GameSearchRequest } from "./types/requests/game-search.request";
import { GameCreateResponse } from "./types/responses/game-create.response";
import { GameDetailsResponse } from "./types/responses/game-details.response";
import { GameNoteResponse } from "./types/responses/game-notes.response";
import { GameSearchResponse } from "./types/responses/game-search.response";
import { GameResponse } from "./types/responses/games.response";
import axios from "axios";

export class BacklogBuddyGamesApiClient extends BacklogBuddyApiClient {
    private readonly gamesEndpoints: GamesEndpoints;
  
    constructor() {
      super();
      this.gamesEndpoints = this.endpoints.games();
    }

    async getGames(): Promise<GameResponse[]> {
      const authorizationToken = this.getAuthorizationToken();
  
      const endpoint = this.gamesEndpoints.getAll;
      const headers = {
        Authorization: authorizationToken,
      };
      const request = () => this.httpService.axiosRef.get(endpoint, { headers });
  
      return this.makeRequest<GameResponse[]>(request, "getGames");
    }
  
    async getGameDetails(options: GameDetailsRequest): Promise<GameDetailsResponse> {
      const authorizationToken = this.getAuthorizationToken();
  
      const endpoint = this.gamesEndpoints.getDetails(options.id);
      const headers = {
        Authorization: authorizationToken,
      };
  
      const request = () =>
        this.httpService.axiosRef.get(endpoint, { headers });
  
      return this.makeRequest<GameDetailsResponse>(request, "getGameDetails");
    } 
  
    async searchGames(options: GameSearchRequest): Promise<GameSearchResponse[]> {
      const authorizationToken = this.getAuthorizationToken();
  
      const endpoint = this.gamesEndpoints.search;
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

    async importGames(platform: string): Promise<SuccessResponse> {
      try {
        const authorizationToken = this.getAuthorizationToken();

        const endpoint = this.gamesEndpoints.import(platform);
        const headers = {
          Authorization: authorizationToken,
        };

        const request = () => this.httpService.axiosRef.post(endpoint, null, { headers });

        return await this.makeRequest<SuccessResponse>(request, "importGames");
      } catch (error) {
        const isAxiosError = axios.isAxiosError(error);
        if (!isAxiosError) {
          throw error;
        }

        const isTimeoutError = error.code === "ECONNABORTED";
        if (!isTimeoutError) {
          throw error;
        }
      }
    }

    async createGame(options: GameCreateRequest): Promise<GameCreateResponse> {
      const endpoint = this.gamesEndpoints.create;
      const headers = {
        Authorization: this.getAuthorizationToken(),
      };

      const request = () => this.httpService.axiosRef.post(endpoint, options, { headers });

      return await this.makeRequest<GameCreateResponse>(request, "createGame");
    }

    async createGameNote(options: GameNoteCreateRequest): Promise<GameNoteResponse> {
      const endpoint = this.gamesEndpoints.createNote(options.game_id);
      const headers = {
        Authorization: this.getAuthorizationToken(),
      };

      const request = () => this.httpService.axiosRef.post(endpoint, { content: options.content }, { headers });

      return await this.makeRequest<GameNoteResponse>(request, "createGameNote");
    }

    async getGameNotes(gameId: string): Promise<GameNoteResponse[]> {
      const endpoint = this.gamesEndpoints.notes(gameId);
      const headers = {
        Authorization: this.getAuthorizationToken(),
      };
    
      const request = () => this.httpService.axiosRef.get(endpoint, { headers });

      return await this.makeRequest<GameNoteResponse[]>(request, "getGameNotes");
    }

    async updateGameNote(options: GameNoteUpdateRequest): Promise<GameNoteResponse> {
      const endpoint = this.gamesEndpoints.updateNote(options.game_id, options.note_id);
      const headers = {
        Authorization: this.getAuthorizationToken(),
      };

      const request = () => this.httpService.axiosRef.put(endpoint, { content: options.content }, { headers });

      return await this.makeRequest<GameNoteResponse>(request, "updateGameNote");
    }

    async deleteGameNote(options: GameNoteDeleteRequest): Promise<SuccessResponse> {
      const endpoint = this.gamesEndpoints.deleteNote(options.game_id, options.note_id);
      const headers = {
        Authorization: this.getAuthorizationToken(),
      };

      const request = () => this.httpService.axiosRef.delete(endpoint, { headers });

      return await this.makeRequest<SuccessResponse>(request, "deleteGameNote");
    }
  }