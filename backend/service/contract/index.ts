import type { AxiosInstance } from "axios";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { CircleAPIBaseURL } from "@service/circle/constants";

interface ContractCaller {
  walletID: string;
  userToken: string;
}

type ExecuteOptions = {
  ABIFunctionSignature: string;
  ABIParameters: any[];
};

interface OwnContractOptions {
  walletAddress: string;
}

interface CreateGroupOptions {
  members: string[];
  groupAddress: string;
  allocation: number;
  delays: number;
}

interface AddUserToGroupOptions {
  groupAddress: string;
  userAddress: string;
}

const CONTRACT_ADDRESS = "0x5c1A58163829C0036D0c3e68A7EA155E092683cf";

export default class ContractSDK {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async execute(caller: ContractCaller, opts: ExecuteOptions) {
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
        ABIFunctionSignature: "createSubGroup(address[], address, uint256, uint8)",
        ABIParameters: [opts.members, opts.groupAddress, opts.allocation, opts.delays],
      });

      return challengeID;
    } catch (error) {
      throw new Error("call to createSubGroup(address[], address, uint256, uint8) failed", { cause: error });
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
    console.debug("Add user to group", caller.walletID, opts)
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
