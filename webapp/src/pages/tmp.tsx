import React, {useEffect, useState} from 'react';
import SideBar from '../components/Layout/sideBar';
import {useUserContext} from "../contexts/userContext";
import {W3SSdk} from "@circle-fin/w3s-pw-web-sdk";

let sdk: W3SSdk

export default function Tmp() {
	const { userConnectResponse } = useUserContext();

	const [challengeId, setChallengeId] = useState<string>('');

	useEffect(() => {
		sdk = new W3SSdk()
	}, [])

	const onSubmit = async () => {
		sdk.setAppSettings({ appId: '1d98a445-1573-50f8-a929-29a3bcb2ee17' })
		sdk.setAuthentication({ userToken: userConnectResponse?.user.userToken, encryptionKey: userConnectResponse?.user.encryptionKey })

		sdk.execute(challengeId, (error, result) => {
			if (error) {
				console.error(`Error: ${error?.message ?? 'Error!'}`)
				return
			}
			console.log(`Challenge: ${result?.type}, Status: ${result?.status}`)
		})
	}

	return (
		<div className={'max-w-full'}>
			<SideBar customSectionHeader={undefined}>
				<>
					<h1 className="mt-12 text-center text-3xl font-semibold text-orange-600">TMP</h1>
					<div className="mb-4">
						<label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="name">
							Name
						</label>
						<input
							value={challengeId}
							onChange={(e) => setChallengeId(e.target.value)}
							className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
							id="challengeId"
							type="text"
							placeholder="challengeId"
						/>
					</div>
					<div className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
						<div className="flex items-center justify-between">
							<button
								className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
								onClick={async () => {
									await onSubmit()
								}}
							>
								Verify
							</button>
						</div>
					</div>
				</>
			</SideBar>
		</div>
	)
		;
}
