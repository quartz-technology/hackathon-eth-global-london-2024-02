export type UserType = {
	pseudo: string;
	email: string;
};

export type User = {
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

export type ConnectUserResponse = {
    message: string;
    user: {
        userToken: string;
        encryptionKey: string;
        userID: string;
		name?: string;
    };
};

type Organisation = {
  id: number;
  name: string;
};

type Group = {
  id: number;
  name: string;
};

export type UserOrganisationResponse = {
  organisations: Organisation[];
  groups: Group[];
};


type Challenge = {
  id: string;
  type: string; // e.g., "2FA", "Email Verification"
  status: string; // e.g., "Pending", "Completed"
};

export type UserChallengesResponse = {
  challenges: Challenge[];
};