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

interface User {
	id: string;
	name: string;
	// Add more user properties as needed
  }

export interface AddUserToOrganisationOpts {
	organisationID: number;
	userID: string;
  }
  
export interface OrganisationDetails {
	message: string,
	organisation: {
	  id: number,
	  name: string,
	  groups?: Array<any>, // Define more detailed type based on your application's needs
	  users?: Array<User> // Define the User type based on your application's needs
	}
  }