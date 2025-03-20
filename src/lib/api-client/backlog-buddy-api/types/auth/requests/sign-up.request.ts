export type SignUpRequest = {
  email: string;
  password: string;
  metadata: {
    name: string;
  };
};
