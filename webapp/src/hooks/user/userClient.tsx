import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {Organisation} from "../../Types/organisation";

export interface UserClientInterface {
	organisation?: Organisation
	loading: boolean; // Is the context loaded

	setOrganisation?:  Dispatch<SetStateAction<Organisation | undefined>>;
}

const userInitialState: UserClientInterface = {
	loading: true,
};

const UseUserClient = () => {
	const [loading, setLoading] = useState<boolean>(userInitialState.loading);
	const [organisation, setOrganisation] = useState<Organisation | undefined>();

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
		setOrganisation
	} as UserClientInterface;
};

export { userInitialState, UseUserClient };
