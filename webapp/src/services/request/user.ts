import { UserType } from '../../Types/userType';
import { backendApi } from '../apiService';

const extendedApi = backendApi.injectEndpoints({
	endpoints: (builder) => ({
		getUser: builder.query<UserType, void>({
			query: () => '/user/self',
			providesTags: ['User'],
		}),
	}),
});

// eslint-disable-next-line import/prefer-default-export
export const { useGetUserQuery } = extendedApi;
