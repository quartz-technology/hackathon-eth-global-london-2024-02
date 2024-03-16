import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";
import { v4 as uuidv4 } from "uuid";

import { AccountType, Blockchain } from "./constants";
import type { ConnectUserOptions, CreateUserOptions, InitWalletOptions, User, Session, Wallet } from "./types";

/**
 * CircleUserSDK is a wrapper around the Circle API to create and manage Users and wallets.
 *
 * It provides the following functionalities:
 * - Create a new User.
 * - Initialize a wallet for an User.
 * - Connect an existing User.
 * - List all Users.
 *
 * This class aims to abstract all the logic related to the Circle API and provide a simple
 * interface to interact with it.
 */
export default class CircleUserSDK {
  /**
   * The Circle API client.
   */
  private client: ReturnType<typeof initiateUserControlledWalletsClient>;

  constructor(apiKey: string) {
    this.client = initiateUserControlledWalletsClient({ apiKey });
  }

  /**
   * Create a new User will generate a user identifier and register
   * it in the circle API.
   * It then connects to the User to get a session token and encryption key and
   * create a wallet.
   *
   * To activate the wallet, the user will need to set a PIN code in the web app.
   *
   * @param opts The options to create the User.
   * @returns The User details.
   *
   * @throws {Error} If the call to the Circle API fails.
   * @throws {Error} If connection attempt fails.
   * @throws {Error} If the wallet initialization fails.
   */
  async createUser(opts: CreateUserOptions): Promise<User> {
    console.debug(`Create a new User: ${opts.name}`);

    // Generate a random user ID
    const userID = CircleUserSDK.generateUUID();

    // Create a user in Circle
    try {
      await this.client.createUser({ userId: userID });
    } catch (error) {
      throw new Error("call to CircleAPI.createUser failed.", { cause: error });
    }

    // Connect the User to get a session token
    let connectResult: Session;
    try {
      connectResult = await this.connectUser({ userID });
    } catch (error) {
      throw new Error("could not connect to the newly created User.", { cause: error });
    }

    // Initialiaze the wallet for the User
    let wallet: Wallet;
    try {
      wallet = await this.initWallet({
        name: opts.name,
        session: connectResult,
      });
    } catch (error) {
      throw new Error("could not initialize wallet for the newly created User.", { cause: error });
    }

    return {
      userID,
      name: opts.name,
      userToken: connectResult.userToken,
      encryptionKey: connectResult.encryptionKey,
      challengeID: wallet.challengeID,
    };
  }

  /**
   * Initialize a wallet for an User.
   *
   * @param opts The options to initialize the wallet.
   * @returns The wallet details.
   *
   * @throws {Error} If the call to the Circle API fails.
   * @throws {Error} If the challenge ID is not returned by Circle.
   */
  private async initWallet(opts: InitWalletOptions): Promise<Wallet> {
    console.debug(`Initialize wallet of User: ${opts.name}`);

    try {
      const res = await this.client.createUserPinWithWallets({
        userToken: opts.session.userToken,
        accountType: AccountType.Sca,
        blockchains: [Blockchain.EthSepolia],
      });

      if (!res.data?.challengeId) {
        throw new Error("could not retrieve challenge ID.");
      }

      return {
        challengeID: res.data.challengeId,
      };
    } catch (error) {
      throw new Error("call to CircleAPI.createUserPinWithWallets failed.", { cause: error });
    }
  }

  /**
   * Create a session to an existing User.
   *
   * @param opts The options to connect to the User.
   * @returns The User session details.
   *
   * @throws {Error} If the call to the Circle API fails.
   * @throws {Error} If the user session is not returned by Circle.
   * @throws {Error} If the encryption key is not returned by Circle.
   */
  async connectUser(opts: ConnectUserOptions): Promise<Session> {
    console.debug("Connect to an existing User");

    try {
      const res = await this.client.createUserToken({
        userId: opts.userID,
      });

      if (!res.data) {
        throw new Error("could not retrieve user session.");
      }

      if (!res.data.encryptionKey) {
        throw new Error("could not retrieve encryption key.");
      }

      return {
        userToken: res.data.userToken,
        encryptionKey: res.data.encryptionKey,
      };
    } catch (error) {
      throw new Error("call to CircleAPI.createUserToken failed.", { cause: error });
    }
  }

  async getUser(userID: string) {
    console.log(`get the user with id: ${userID}`);

    try {
      const res = await this.client.getUser({ userId: userID });

      return res.data;
    } catch (error) {
      throw new Error("call to CircleAPI.getUser failed.", { cause: error });
    }
  }

  async getUserWallet(userID: string) {
    console.log(`get the wallets of the user`);

    try {
      const res = await this.client.listWallets({
		    userId: userID,
	  });
      if (!res.data?.wallets) {
        throw new Error("could not retrieve user wallets.");
      }

	  return res.data.wallets ?? []
    } catch (error) {
      throw new Error("call to CircleAPI.getWallets failed.", { cause: error });
    }
  }

  /**
   * Generate a random UUID v4.
   */
  private static generateUUID(): string {
    return uuidv4();
  }
}

export type { ConnectUserOptions, CreateUserOptions, InitWalletOptions, User, Session, Wallet };
