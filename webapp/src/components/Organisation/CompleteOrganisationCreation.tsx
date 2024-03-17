import React, {useCallback, useEffect, useState} from 'react';
import {useUserContext} from "../../contexts/userContext";

import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'

let sdk: W3SSdk


export default function CompleteOrganisationCreation() {
	const { organisation, userConnectResponse } = useUserContext();

	useEffect(() => {
		sdk = new W3SSdk()
	}, [])

	const onSubmit = async () => {
		if (!organisation || !userConnectResponse) return

		sdk.setAppSettings({ appId: '1d98a445-1573-50f8-a929-29a3bcb2ee17' })
		sdk.setAuthentication({ userToken: userConnectResponse?.user.userToken, encryptionKey: userConnectResponse?.user.encryptionKey })

		sdk.execute(organisation.challengeID, (error, result) => {
			if (error) {
				console.error(`Error: ${error?.message ?? 'Error!'}`)
				return
			}
			console.log(`Challenge: ${result?.type}, Status: ${result?.status}`)
		})
	}

	return (
		<>
			{!!organisation && <div className="w-full max-w-xs">
			<div className='flex flex-col items-center justify-cente'>
    				<div className='h-10 w-0 mx-auto border-r-4 border-dashed border-blue-300'/>
					<div className="mb-4">
						Name: {!!organisation && organisation.organisation.name}
					</div>
					<div className="flex items-center justify-between">
						<button
							className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
							onClick={async () => { await onSubmit()}}
						>
							Verify
						</button>
					</div>
				</div>
			</div>}
		</>
	);
}
