import { expect, test } from 'bun:test';

import CircleUserSDK from './index';

test('Initiliaze circle service', async () => {
	const API_KEY = Bun.env.CIRCLE_API_KEY;
	if (!API_KEY) {
		throw new Error('Circle API Key is not defined');
	}

	expect(API_KEY).not.toBeUndefined();

	const circleUserSDK = new CircleUserSDK(API_KEY);
	expect(circleUserSDK).not.toBeUndefined();
});

test('Create a new user', async () => {
	const API_KEY = Bun.env.CIRCLE_API_KEY;
	if (!API_KEY) {
		throw new Error('Circle API Key is not defined');
	}

	expect(API_KEY).not.toBeUndefined();

	const circleUserSDK = new CircleUserSDK(API_KEY);
	expect(circleUserSDK).not.toBeUndefined();

	const user = await circleUserSDK.createUser({ name: 'test' });
	expect(user).not.toBeUndefined();
	expect(user.name).toBe('test');

	expect(user.challengeID).not.toBeUndefined();
	expect(user.encryptionKey).not.toBeUndefined();
	expect(user.userToken).not.toBeUndefined();
});

test('Connect to an existing user', async () => {
	const API_KEY = Bun.env.CIRCLE_API_KEY;
	if (!API_KEY) {
		throw new Error('Circle API Key is not defined');
	}

	expect(API_KEY).not.toBeUndefined();

	const circleUserSDK = new CircleUserSDK(API_KEY);
	expect(circleUserSDK).not.toBeUndefined();

	const user = await circleUserSDK.createUser({ name: 'test' });
	expect(user).not.toBeUndefined();
	expect(user.name).toBe('test');

	// Connect the user
	const session = await circleUserSDK.connectUser({ userID: user.userID });

	expect(session).not.toBeUndefined();
	expect(session.userToken).not.toBeUndefined();
	expect(session.encryptionKey).not.toBeUndefined();
})
