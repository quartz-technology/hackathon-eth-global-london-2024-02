import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {Organisation} from "../../Types/organisation";
import { ConnectUserResponse, CreateUserResponse } from 'src/Types/userType';

export interface UserClientInterface {
	organisation?: Organisation
	loading: boolean; // Is the context loaded
	userResponse?: CreateUserResponse;
	setUserResponse?: Dispatch<SetStateAction<CreateUserResponse | undefined>>;
	userConnectResponse?: ConnectUserResponse;
	setUserConnectResponse?: Dispatch<SetStateAction<ConnectUserResponse | undefined>>;


	setOrganisation?:  Dispatch<SetStateAction<Organisation | undefined>>;
}

const userInitialState: UserClientInterface = {
	loading: true,
};

const UseUserClient = () => {
	const [loading, setLoading] = useState<boolean>(userInitialState.loading);
	const [organisation, setOrganisation] = useState<Organisation | undefined>();
	const [userResponse, setUserResponse] = useState<CreateUserResponse | undefined>();
	const [userConnectResponse, setUserConnectResponse] = useState<CreateUserResponse | undefined>();

	/**
	 * Init the application
	 */
	useEffect(() => {
		setLoading(true);
		setLoading(false);
	}, []);

	return {
		loading,
		organisation,
		setOrganisation,
		userResponse,
		setUserResponse,
		userConnectResponse,
		setUserConnectResponse
	} as UserClientInterface;
};

export { userInitialState, UseUserClient };
