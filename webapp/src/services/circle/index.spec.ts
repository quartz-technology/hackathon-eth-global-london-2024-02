import { expect, test } from '@jest/globals';

import CircleUserSDK from './index';

test('Initiliaze circle service', async () => {
	const API_KEY = process.env.NEXT_PUBLIC_CIRCLE_API_KEY;
	if (!API_KEY) {
		throw new Error('Circle API Key is not defined');
	}

	expect(API_KEY).not.toBeUndefined();

	const circleUserSDK = new CircleUserSDK(API_KEY);
	expect(circleUserSDK).not.toBeUndefined();

	// Test listUsers
	const users = await circleUserSDK.listUsers();
	expect(users).not.toBeUndefined();
});

test('Create a new organisation', async () => {
	const API_KEY = process.env.NEXT_PUBLIC_CIRCLE_API_KEY;
	if (!API_KEY) {
		throw new Error('Circle API Key is not defined');
	}

	expect(API_KEY).not.toBeUndefined();

	const circleUserSDK = new CircleUserSDK(API_KEY);
	expect(circleUserSDK).not.toBeUndefined();

	const organisation = await circleUserSDK.createOrganisation({ name: 'test' });
	expect(organisation).not.toBeUndefined();
	expect(organisation.name).toBe('test');

	expect(organisation.challengeID).not.toBeUndefined();
	expect(organisation.encryptionKey).not.toBeUndefined();
	expect(organisation.userToken).not.toBeUndefined();
});
