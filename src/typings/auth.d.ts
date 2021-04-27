export interface UserSimple {
  id: number;
  username: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  isBetaUser: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
