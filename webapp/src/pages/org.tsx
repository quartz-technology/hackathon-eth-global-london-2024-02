import React from 'react';
import CreateOrganisationForm from 'src/components/Organisation/CreateOrganisationForm';

import SideBar from '../components/Layout/sideBar';

export default function Org() {
	return (
		<div className={'max-w-full'}>
			<SideBar customSectionHeader={undefined}>
				<h1 className="mt-12 text-center text-3xl font-semibold text-orange-600">Create an organisation</h1>
				<CreateOrganisationForm />
			</SideBar>
		</div>
	);
}
