export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export type UserCreateInput = {
  username: string;
  email: string;
  password: string;
};

export type UserLoginInput = {
  email: string;
  password: string;
};

export type UserResponse = Omit<User, 'password'>;
