import React from 'react';

import SideBar from '../components/Layout/sideBar';
import { useUserContext } from '../contexts/userContext';
import { FlowProvider } from 'src/contexts/flowContext';
import Dashboard from 'src/components/Reactflow/Dashboard';

export default function Home() {
	const { user } = useUserContext();

	return (
		<div className={'w-full '}>
			<SideBar customSectionHeader={undefined}>
				<FlowProvider>
					{/* TODO: REMOVE PADDING */}
					<div className={ "w-[50vw] h-[50vh]"}>
						<Dashboard />

					</div>
				</FlowProvider>
			</SideBar>
		</div>
	);
}
