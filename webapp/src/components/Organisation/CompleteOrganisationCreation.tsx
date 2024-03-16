import React, {useCallback, useEffect, useState} from 'react';
import {useUserContext} from "../../contexts/userContext";

import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'

let sdk: W3SSdk


const a = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZlbG9wZXJFbnRpdHlFbnZpcm9ubWVudCI6IlRFU1QiLCJlbnRpdHlJZCI6Ijc4ODQzNWMyLTgyOGQtNDg3OS1iZjU5LWRjNDY3Njg4ZWE1YyIsImV4cCI6MTcxMDYyODIzNywiaWF0IjoxNzEwNjI0NjM3LCJpbnRlcm5hbFVzZXJJZCI6ImZlYWM2OWI0LTNmY2YtNWE4Ny1iZjc5LTM0NjE5ODhlOTRhNCIsImlzcyI6Imh0dHBzOi8vcHJvZ3JhbW1hYmxlLXdhbGxldC5jaXJjbGUuY29tIiwianRpIjoiMTY4ODNkZDEtOWMxYS00N2UwLWFmMjUtNzljNmU3NTI4YjQwIiwic3ViIjoiYzk1Y2Q0MzQtYjU5Ny00MWY5LWIyMDktZDg4Y2M3NjQ5OWRlIn0.dKLbao_R2aipICPwbli3RDlMVTOiVkMjYHRQh3QL49J7AARXVFKH47PWSf-WEPHFxx3eIF6y3P_0TvDrW-YhTZ2dlYfzuitLmxSBd5cMeLDwBbrXGaGvFl0C2R8j94R5qvAF98zmkSVgn7-UH2_qzwv4LPFV-T6MbA-BQ10t6SKL6dDQ_r6QfSWEJSUhxEgWbs-zrh_nKc1f0rKz5ZP212gSBl1JPpjkmzHQ1Jl0X5YgSEtMLwOVAsaH2hMU7Zm-9yj4qXAxuoN55-yeu8vGwkSNMuQ1h3B3lZXXRX-oaDnA5PwieoujtsBzWW1gVyP2gerBNalLBBe7H-AUpY4glA'
const b = 'flTu6RSw5rVzC0tFZ2fhoyThqJgVWWfZ9Yph4VAsJTs='

export default function CompleteOrganisationCreation() {
	const { organisation } = useUserContext();

	useEffect(() => {
		sdk = new W3SSdk()
	}, [])

	const onSubmit = async () => {

		sdk.setAppSettings({ appId: '1d98a445-1573-50f8-a929-29a3bcb2ee17' })
		sdk.setAuthentication({ userToken: a, encryptionKey: b })

		sdk.execute('230a5b79-009d-5022-aa20-528bca406eec', (error, result) => {
			if (error) {
				console.error(`Error: ${error?.message ?? 'Error!'}`)
				return
			}
			console.log(`Challenge: ${result?.type}, Status: ${result?.status}`)
		})
	}

	return (
		<>
			{true && <div className="w-full max-w-xs">
				<div className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
					<div className="mb-4">
						{/*Name: {!!organisation && organisation.name}*/}
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
