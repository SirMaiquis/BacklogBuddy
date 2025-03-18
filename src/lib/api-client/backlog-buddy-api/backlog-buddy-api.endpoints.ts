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
    };
  };

  public games = () => {
    const base = `${this.BASE_URL}/games`;

    return {
      getAll: `${base}`,
      getDetails: (id: string) => `${base}/${id}`,
      search: `${base}/search`,
      create: `${base}`,
      update: (id: string) => `${base}/${id}`,
      delete: (id: string) => `${base}/${id}`,
      importFromSteam: `${base}/import/steam`,
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
      startLinking: `${base}/link`,
      confirmLinking: `${base}/link`,
      unlink: `${base}/link`,
    };
  };
}
