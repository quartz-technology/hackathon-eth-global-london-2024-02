import { ConnectUserResponse, CreateUserResponse, User, UserChallengesResponse, UserOrganisationResponse } from 'src/Types/userType';
import { backendApi } from '../apiService';

const extendedApi = backendApi.injectEndpoints({
    endpoints: (builder) => ({
      createUser: builder.mutation<CreateUserResponse, { name: string }>({
        query: (body) => ({
          url: '/user/register',
          method: 'POST',
          body,
          credentials: 'include',
        }),
        invalidatesTags: ['User'],
      }),
      connectUser: builder.mutation<ConnectUserResponse, { name: string }>({
        query: (body) => ({
          url: '/user/connect',
          method: 'POST',
          body,
          credentials: 'include',
        }),
        invalidatesTags: ['User'],
      }),
      getUserOrganisation: builder.query<UserOrganisationResponse, void>({
        query: () => ({
          url: '/user/organisation',
          method: 'GET',
          credentials: 'include',
        }),
        providesTags: ['User'],
      }),
      getUserChallenges: builder.query<UserChallengesResponse, void>({
        query: () => ({
          url: '/user/challenge',
          method: 'GET',
          credentials: 'include',
        }),
        providesTags: ['User'],
      }),
      getUserById: builder.query<User, { userID: string }>({
        query: ({ userID }) => ({
          url: `/user/${userID}`,
          method: 'GET',
          credentials: 'include',
        }),
        providesTags: ['User'],
      }),
    }),
  });
  
  // Export hooks for the operations
  export const {
    useCreateUserMutation,
    useConnectUserMutation,
    useGetUserOrganisationQuery,
    useGetUserChallengesQuery,
    useGetUserByIdQuery,
  } = extendedApi;
