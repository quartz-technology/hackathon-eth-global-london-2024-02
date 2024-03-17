import { backendApi } from '../apiService';
import { CreateGroupRequest, CreateGroupResponse, AddUserToGroupRequest, JoinGroupResponse, GroupIDParam, GroupDetailsResponse } from 'src/Types/group';

const extendedApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation<CreateGroupResponse, CreateGroupRequest>({
      query: (body) => ({
        url: '/group',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Group'],
    }),
    addUserToGroup: builder.mutation<JoinGroupResponse, AddUserToGroupRequest & GroupIDParam>({
      query: ({ groupID, ...body }) => ({
        url: `/group/${groupID}/add`,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Group'],
    }),
    getGroupById: builder.query<GroupDetailsResponse, GroupIDParam>({
      query: ({ groupID }) => ({
        url: `/group/${groupID}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Group'],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useAddUserToGroupMutation,
  useGetGroupByIdQuery,
} = extendedApi;
