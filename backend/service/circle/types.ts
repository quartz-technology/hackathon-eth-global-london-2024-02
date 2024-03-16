export interface CreateUserOptions {
	name: string;
}

export interface ConnectUserOptions {
	userID: string;
}

export interface InitWalletOptions {
	name: string;
	session: Session;
}

export interface Session {
	userToken: string;
	encryptionKey: string;
}

export interface Wallet {
	challengeID: string;
}

export interface User {
	userID: string;
	name: string;
	userToken: string;
	encryptionKey: string;
	challengeID: string;
}