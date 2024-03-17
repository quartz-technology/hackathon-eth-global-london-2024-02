import { v4 as uuidv4 } from "uuid";

import { CircleAPIBaseURL } from "@service/circle/constants";
import type {
  AddUserToGroupOptions,
  ContractCaller,
  CreateGroupOptions,
  ExecuteOptions,
  OwnContractOptions,
} from "./types";

const CONTRACT_ADDRESS = "0x80F2b980eeCAF31e8f9d2c9DDf7cdD565830E530";

/**
 * The SDK for interacting with the contract.
 *
 * This is a wraper aimed at simplifying the interaction with the contract.
 */
export default class ContractSDK {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async execute(caller: ContractCaller, opts: ExecuteOptions) {
    console.log(caller, opts);

    const url = `${CircleAPIBaseURL}/transactions/contractExecution`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "X-User-Token": caller.userToken,
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        idempotencyKey: ContractSDK.generateUUID(),
        contractAddress: CONTRACT_ADDRESS,
        walletId: caller.walletID,
        abiFunctionSignature: opts.ABIFunctionSignature,
        abiParameters: opts.ABIParameters,
        feeLevel: "LOW",
      }),
    };

    try {
      const response = await fetch(url, options);

      const data = (await response.json()) as any;
      return data.data.challengeId;
    } catch (error) {
      throw new Error("call to CircleAPI.execute transaction failed", { cause: error });
    }
  }

  /**
   * Transfer the ownership of a contract to the user's wallet.
   *
   * @param caller The user's wallet and token
   * @param opts Own contract options
   * @returns The challenge ID to verify
   */
  async ownContract(caller: ContractCaller, opts: OwnContractOptions) {
    try {
      const challengeID = await this.execute(caller, {
        ABIFunctionSignature: "claimContract(address)",
        ABIParameters: [opts.walletAddress],
      });

      return challengeID;
    } catch (error) {
      throw new Error("call to claimContract(address) failed", { cause: error });
    }
  }

  /**
   * Create a group on the contract
   *
   * @param caller The user's wallet and token
   * @param opts Create group options
   * @returns The challenge ID to verify
   */
  async createGroup(caller: ContractCaller, opts: CreateGroupOptions) {
    try {
      const challengeID = await this.execute(caller, {
        ABIFunctionSignature: "createSubGroup(address, uint256, uint8)",
        ABIParameters: [ opts.groupAddress, opts.allocation, opts.delays],
      });

      return challengeID;
    } catch (error) {
      throw new Error("call to createSubGroup(address, uint256, uint8) failed", { cause: error });
    }
  }

  /**
   * Add a user to a group on the contract
   *
   * @param caller The user's wallet and token
   * @param opts Add user to group options
   * @returns The challenge ID to verify
   */
  async addUserToGroup(caller: ContractCaller, opts: AddUserToGroupOptions) {
    try {
      const challengeID = await this.execute(caller, {
        ABIFunctionSignature: "pushAddressToSubGroups(address, address)",
        ABIParameters: [opts.groupAddress, opts.userAddress],
      });

      return challengeID;
    } catch (error) {
      throw new Error("call to addUserToGroup(address) failed", { cause: error });
    }
  }

  /**
   * Generate a random UUID v4.
   */
  private static generateUUID(): string {
    return uuidv4();
  }
}
