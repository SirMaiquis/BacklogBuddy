export class BacklogBuddyApiEndpoints {
  private readonly BASE_URL;

  constructor(baseUrl: string) {
    this.BASE_URL = baseUrl;
  }

  public auth = () => {
    const base = `${this.BASE_URL}/auth`;

    return {
      signIn: `${base}/signin`,
      signUp: `${base}/signup`,
      signOut: `${base}/signout`,
      resetPassword: `${base}/reset-password`,
      confirmResetPassword: `${base}/confirm-reset-password`,
      refreshSession: `${base}/session`,
    };
  };

  public games = () => {
    const base = `${this.BASE_URL}/games`;

    return {
      getAll: `${base}`,
      getDetails: (id: string) => `${base}/details/${id}`,
      search: `${base}/search`,
      create: `${base}`,
      update: (id: string) => `${base}/${id}`,
      delete: (id: string) => `${base}/${id}`,
      import: (platform: string) => `${base}/import/${platform}`,
      notes: (gameId: string) => `${base}/${gameId}/notes`,
      createNote: (gameId: string) => `${base}/${gameId}/notes`,
      updateNote: (gameId: string, noteId: string) => `${base}/${gameId}/notes/${noteId}`,
      deleteNote: (gameId: string, noteId: string) => `${base}/${gameId}/notes/${noteId}`,
    };
  };

  public landing = () => {
    const base = `${this.BASE_URL}/landing`;

    return {
      getLandingData: `${base}`,
    };
  };

  public profile = () => {
    const base = `${this.BASE_URL}/profile`;

    return {
      getProfileData: `${base}`,
      initLink: (provider: string) => `${base}/link/${provider}`,
      confirmLink: (provider: string, metadata: string) => `${base}/link/${provider}${metadata}`,
      unlink: (provider: string) => `${base}/link/${provider}`,
    };
  };
}

export type AuthEndpoints = ReturnType<BacklogBuddyApiEndpoints['auth']>;
export type GamesEndpoints = ReturnType<BacklogBuddyApiEndpoints['games']>;
export type LandingEndpoints = ReturnType<BacklogBuddyApiEndpoints['landing']>;
export type ProfileEndpoints = ReturnType<BacklogBuddyApiEndpoints['profile']>;