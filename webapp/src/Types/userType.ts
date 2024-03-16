export type UserType = {
	pseudo: string;
	email: string;
};

type User = {
  userID: string;
  name: string;
  userToken: string;
  encryptionKey: string;
  challengeID: string;
};

export type CreateUserResponse = {
  message: string;
  user: User;
};