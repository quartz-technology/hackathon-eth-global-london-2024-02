import React from 'react';
import CreateOrganisationForm from 'src/components/Organisation/CreateOrganisationForm';

import SideBar from '../components/Layout/sideBar';
import CompleteOrganisationCreation from "../components/Organisation/CompleteOrganisationCreation";
import CreateUserForm from 'src/components/User/CreateUserForm';
import CompleteUserCreation from 'src/components/User/CompleteUserCreation';

export default function User() {
	return (
		<div className={'max-w-full'}>
			<SideBar customSectionHeader={undefined}>
				<h1 className="mt-12 text-center text-3xl font-semibold text-orange-600">Create an user</h1>
				<CreateUserForm />
				<CompleteUserCreation />
			</SideBar>
		</div>
	);
}
