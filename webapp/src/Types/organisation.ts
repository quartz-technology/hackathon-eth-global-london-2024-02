export interface CreateOrganisationOpts {
	name: string;
}

export interface Organisation {
	message: string,
	organisation: {
		id: number,
		name: string
	},
	challengeID: string
}
