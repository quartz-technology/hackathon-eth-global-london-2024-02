import type { AxiosInstance } from "axios";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { CircleAPIBaseURL } from "@service/circle/constants";

interface ExecuteOptions {
  walletID: string;
  userToken: string;
  endpoint: string;
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
  // TODO(RGascoin): Add the smart contract address
  private readonly address = "";

  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: CircleAPIBaseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  private async execute(opts: ExecuteOptions) {
    try {
      const res = await this.client.post(
        `/${opts.endpoint}`,
        {
          idempotencyKey: ContractSDK.generateUUID(),
          contractAddres: CONTRACT_ADDRESS,
          walletID: opts.walletID,
        },
        {
          headers: {
            "X-User-Token": opts.userToken,
          },
        }
      );

      return res.data;
    } catch (error) {
      throw new Error(`call to CircleAPI.${opts.endpoint} failed.`, { cause: error });
    }
  }

  async ownContract(opts: OwnContractOptions) {
    return this.execute({
      walletID: opts.walletID,
      userToken: opts.userToken,
      endpoint: "transactions/contractExecution",
      ABIFunctionSignature: "claimContract(address)",
      ABIParameters: [opts.walletAddress],
    });
  }

  /**
   * Generate a random UUID v4.
   */
  private static generateUUID(): string {
    return uuidv4();
  }
}
