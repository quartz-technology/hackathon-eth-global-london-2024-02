import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useGetUserQuery } from '../../services/request/user';
import { UserType } from '../../Types/userType';

export interface UserClientInterface {
	loading: boolean; // Is the context loaded
}

const userInitialState: UserClientInterface = {
	loading: true,
};

const UseUserClient = () => {
	const [loading, setLoading] = useState<boolean>(userInitialState.loading);

	/**
	 * Init the application
	 */
	useEffect(() => {

		setLoading(true);
		setLoading(false);
	}, []);

	return {
		loading,
	} as UserClientInterface;
};

export { userInitialState, UseUserClient };
