import { SerializedError } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const apiBase = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001',
});

export type FetchBaseQueryErrorType = { status: number; data: { message: string } };
export const isFetchBaseQueryErrorType = (err: FetchBaseQueryError | SerializedError): err is FetchBaseQueryErrorType =>
	'status' in err;

export const backendApi = createApi({
	tagTypes: ['User'],
	reducerPath: 'backendApi',
	baseQuery: apiBase,
	endpoints: () => ({}),
});
