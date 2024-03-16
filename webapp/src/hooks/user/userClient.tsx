import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useGetUserQuery } from '../../services/request/user';
import { UserType } from '../../Types/userType';

export interface UserClientInterface {
	user?: UserType; // User
	loading: boolean; // Is the context loaded

	setUser?: Dispatch<SetStateAction<UserType | undefined>>; // Set the user
}

const userInitialState: UserClientInterface = {
	loading: true,
};

const UseUserClient = () => {
	const [loading, setLoading] = useState<boolean>(userInitialState.loading);

	// Fetch de user whenever the context is used
	const { data: fetchedUser, isLoading: isLoadingFetchedUser } = useGetUserQuery();
	const [user, setUser] = useState<UserType | undefined>(undefined);

	const initUserModule = () => {
		if (!fetchedUser) return;
		console.log('user:', fetchedUser);
		setUser(fetchedUser);
	};

	/**
	 * Init the application
	 */
	useEffect(() => {
		if (isLoadingFetchedUser) return;

		setLoading(true);
		initUserModule();
		setLoading(false);
	}, [isLoadingFetchedUser]);

	return {
		user,
		loading,
		setUser,
	} as UserClientInterface;
};

export { userInitialState, UseUserClient };
