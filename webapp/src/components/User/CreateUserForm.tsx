import React, {useEffect, useState} from 'react';
import {useUserContext} from "../../contexts/userContext";
import { useCreateUserMutation } from 'src/services/request/user';

export default function CreateUserForm() {
	const { setUserResponse } = useUserContext();

	const [name, setName] = useState<string>('');

	const [trigger] = useCreateUserMutation();

	const submit = async () => {
		console.log(`Submitting user creation with name: ${name}`);

		if (name.length === 0) {
			console.error('Name is required');
			return;
		}

		const res = await trigger({ name });
		if (!setUserResponse) return;
		setUserResponse((res as any).data)

		console.log((res as any).data);
	};

	return (
		<div className="w-full max-w-xs">
			<div className="rounded bg-white px-8 pb-8 pt-6 shadow-md">
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="name">
						Name
					</label>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						id="name"
						type="text"
						placeholder="Name"
					/>
				</div>
				<div className="flex items-center justify-center">
					<button
						className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
						onClick={async () => { await submit() }}
					>
						Create
					</button>
				</div>
			</div>
		</div>
	);
}
