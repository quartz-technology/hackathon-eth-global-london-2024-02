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

export const { useGetUserQuery } = extendedApi;
