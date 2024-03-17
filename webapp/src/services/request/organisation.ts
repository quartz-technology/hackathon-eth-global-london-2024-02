import { Organisation } from '../../Types/organisation';
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
	}),
});

// eslint-disable-next-line import/prefer-default-export
export const { useCreateOrganisationMutation } = extendedApi;
