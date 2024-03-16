import React from 'react';

import SideBar from '../components/Layout/sideBar';
import { useUserContext } from '../contexts/userContext';

export default function Home() {
	return (
		<div className={'max-w-full'}>
			<SideBar customSectionHeader={undefined}>
				<h1 className="mt-12 text-center text-3xl font-semibold text-orange-600">Introducing XX</h1>
			</SideBar>
		</div>
	);
}
