import React, { createContext, ReactNode, useContext } from 'react';

import { UserClientInterface, userInitialState, UseUserClient } from '../hooks/user/userClient';

const userContext = createContext<UserClientInterface>(userInitialState);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
	const userProviderState = UseUserClient();

	return <userContext.Provider value={userProviderState}>{children}</userContext.Provider>;
};

export function useUserContext() {
	return useContext(userContext);
}
