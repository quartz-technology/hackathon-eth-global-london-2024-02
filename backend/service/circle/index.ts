import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets';
import { v4 as uuidv4 } from 'uuid';

import { AccountType, Blockchain } from './constants';
import type { ConnectOrganisationOptions, CreateOrganisationOptions, InitWalletOptions, Organisation, OrganisationSession, Wallet } from './types';

export default class CircleUserSDK {
	private client: ReturnType<typeof initiateUserControlledWalletsClient>;

	constructor(apiKey: string) {
		this.client = initiateUserControlledWalletsClient({
			apiKey,
		});
	}

	async createOrganisation(opts: CreateOrganisationOptions): Promise<Organisation> {
		console.debug(`Create a new organisation: ${opts.name}`);

		const userID = CircleUserSDK.generateUUID();

		// Create a user in Circle
		try {
			await this.client.createUser({ userId: userID });

			// TODO(TomChv): Call smart contract to register new organisation
		} catch (error) {
			throw new Error('call to CircleAPI.createUser failed.', { cause: error });
		}

		// Connect the organisation to get a session token
		let connectResult: OrganisationSession;
		try {
			connectResult = await this.connectOrganisation({ userID });
		} catch (error) {
			throw new Error('could not connect to the newly created organisation.', { cause: error });
		}

		// Initialiaze the wallet for the organisation
		let wallet: Wallet;
		try {
			wallet = await this.initWallet({
				name: opts.name,
				session: connectResult,
			});
		} catch (error) {
			throw new Error('could not initialize wallet for the newly created organisation.', { cause: error });
		}

		return {
			name: opts.name,
			userToken: connectResult.userToken,
			encryptionKey: connectResult.encryptionKey,
			challengeID: wallet.challengeID,
		};
	}

	async initWallet(opts: InitWalletOptions): Promise<Wallet> {
		console.debug(`Initialize wallet of organisation: ${opts.name}`);

		try {
			const res = await this.client.createUserPinWithWallets({
				userToken: opts.session.userToken,
				accountType: AccountType.Sca,
				blockchains: [Blockchain.EthSepolia],
			});

			if (!res.data?.challengeId) {
				throw new Error('could not retrieve challenge ID.');
			}

			return {
				challengeID: res.data.challengeId,
			};
		} catch (error) {
			throw new Error('call to CircleAPI.createUserPinWithWallets failed.', { cause: error });
		}
	}

	async connectOrganisation(opts: ConnectOrganisationOptions): Promise<OrganisationSession> {
		console.debug('Connect to an existing organisation');

		try {
			const res = await this.client.createUserToken({
				userId: opts.userID,
			});

			if (!res.data) {
				throw new Error('could not retrieve user session.');
			}

			if (!res.data.encryptionKey) {
				throw new Error('could not retrieve encryption key.');
			}

			return {
				userToken: res.data.userToken,
				encryptionKey: res.data.encryptionKey,
			};
		} catch (error) {
			throw new Error('call to CircleAPI.createUserToken failed.', { cause: error });
		}
	}

	async listUsers() {
		// Call smart contract to list organisation
		try {
			const res = await this.client.listUsers();
			return res.data?.users || [];
		} catch (error) {
			throw new Error('call to CircleAPI.listUsers failed.', { cause: error });
		}
	}

	private static generateUUID(): string {
		return uuidv4();
	}
}
