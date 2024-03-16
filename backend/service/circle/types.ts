export interface CreateOrganisationOptions {
	name: string;
}

export interface ConnectOrganisationOptions {
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

export interface Organisation {
	name: string;
	userToken: string;
	encryptionKey: string;
	challengeID: string;
}