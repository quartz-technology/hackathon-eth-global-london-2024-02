import React, {useCallback, useEffect, useState} from 'react';
import {useUserContext} from "../../contexts/userContext";

import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'

let sdk: W3SSdk


export default function CompleteUserCreation() {
	const { userResponse } = useUserContext();

	useEffect(() => {
		sdk = new W3SSdk()
	}, [])

	const onSubmit = async () => {
		if (!userResponse ) return

		sdk.setAppSettings({ appId: '1d98a445-1573-50f8-a929-29a3bcb2ee17' })
		sdk.setAuthentication({ userToken: userResponse?.user.userToken, encryptionKey: userResponse?.user.encryptionKey })

		sdk.execute(userResponse.user.challengeID, (error, result) => {
			if (error) {
				console.error(`Error: ${error?.message ?? 'Error!'}`)
				return
			}
			console.log(`Challenge: ${result?.type}, Status: ${result?.status}`)
		})
	}

	return (
		<>
			{!!userResponse && <div className="w-full max-w-xs">
				<div className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
					<div className="mb-4">
						Name: {!!userResponse && userResponse.user.name}
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
