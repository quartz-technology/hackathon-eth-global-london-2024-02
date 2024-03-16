export interface CreateOrganisationOpts {
	name: string;
}

export interface Organisation {
	name: string;
	userToken: string;
	encryptionKey: string;
	challengeID: string;
}
