export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export type UserCreateInput = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type UserLoginInput = Pick<User, 'email' | 'password'>;
export type UserRegisterInput = Pick<User, 'email' | 'password' | 'username'>;
export type UserResponse = Omit<User, 'password'>;
