import React from 'react';

import SideBar from '../components/Layout/sideBar';
import { FlowProvider } from 'src/contexts/flowContext';
import Dashboard from 'src/components/Reactflow/Dashboard';
import { ModalProvider } from 'src/contexts/modalContext';
import DynamicModal from 'src/components/Modals/DynamicModal';

export default function Home() {
	return (
		<div className={'w-full '}>

			<SideBar customSectionHeader={undefined}>
				<FlowProvider>
					{/* TODO: REMOVE PADDING */}
						<div className={ "w-[50vw] h-[50vh]"}>
							<Dashboard />
							<DynamicModal />
						</div>
				</FlowProvider>
			</SideBar>
		</div>
	);
}
