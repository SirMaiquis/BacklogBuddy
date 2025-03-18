export type SignInResponse = {
  user: User;
  session: Session;
};

type User = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  identities: Identity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
};

type AppMetadata = {
  provider: string;
  providers: string[];
};

type UserMetadata = {
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
};

type Identity = {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: IdentityData;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
};

type IdentityData = {
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
};

type Session = {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User2;
};

type User2 = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata2;
  user_metadata: UserMetadata2;
  identities: Identity2[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
};

type AppMetadata2 = {
  provider: string;
  providers: string[];
};

type UserMetadata2 = {
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
};

type Identity2 = {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: IdentityData2;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
};

type IdentityData2 = {
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
};
