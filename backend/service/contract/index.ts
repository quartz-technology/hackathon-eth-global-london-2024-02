import type { AxiosInstance } from "axios";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { CircleAPIBaseURL } from "@service/circle/constants";

interface ExecuteOptions {
  walletID: string;
  userToken: string;
  ABIFunctionSignature: string;
  ABIParameters: string[];
}

interface OwnContractOptions {
  walletID: string;
  userToken: string;
  walletAddress: string;
}

const CONTRACT_ADDRESS = "0x5c1A58163829C0036D0c3e68A7EA155E092683cf";

export default class ContractSDK {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async execute(opts: ExecuteOptions) {
    const url = `${CircleAPIBaseURL}/transactions/contractExecution`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "X-User-Token": opts.userToken,
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        idempotencyKey: ContractSDK.generateUUID(),
        contractAddress: CONTRACT_ADDRESS,
        walletId: opts.walletID,
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
   * @param opts Own contract options
   * @returns The challege ID to verify
   */
  async ownContract(opts: OwnContractOptions) {
    try {
      const challengeID = await this.execute({
        walletID: opts.walletID,
        userToken: opts.userToken,
        ABIFunctionSignature: "claimContract(address)",
        ABIParameters: [opts.walletAddress],
      });

      return challengeID
    } catch (error) {
      throw new Error("call to claimContract(address) failed", { cause: error });
    }
  }

  /**
   * Generate a random UUID v4.
   */
  private static generateUUID(): string {
    return uuidv4();
  }
}
