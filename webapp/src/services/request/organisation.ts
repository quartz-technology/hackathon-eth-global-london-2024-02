import { Organisation, OrganisationDetails } from '../../Types/organisation';
import { backendApi } from '../apiService';

const extendedApi = backendApi.injectEndpoints({
	endpoints: (builder) => ({
	  createOrganisation: builder.mutation<Organisation, { name: string }>({
		query: (body) => ({
		  url: '/organisation',
		  method: 'POST',
		  body,
		  credentials: 'include',
		}),
		invalidatesTags: ['Organisation'],
	  }),
	  addUserToOrganisation: builder.mutation<void, { organisationID: number, username: string }>({
		query: ({ organisationID, username }) => ({
		  url: `/organisation/${organisationID}/add`,
		  method: 'POST',
		  body: { username },
		  credentials: 'include',
		}),
		invalidatesTags: ['Organisation'],
	  }),
	  getOrganisationById: builder.query<OrganisationDetails, { organisationID: number }>({
		query: ({ organisationID }) => ({
		  url: `/organisation/${organisationID}`,
		  method: 'GET',
		  credentials: 'include',
		}),
		providesTags: ['Organisation'],
	  }),
	}),
  });
  
  export const { useCreateOrganisationMutation, useAddUserToOrganisationMutation, useLazyGetOrganisationByIdQuery } = extendedApi;
  
