import { createWalletClient, http, publicActions, type Hex, type PrivateKeyAccount, type WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { normalize } from "viem/ens";

import config from "@config";

const ETH_COIN_TYPE = 60;

export default class EnsSDK {
  private wallet: WalletClient;

  constructor() {
    const account = privateKeyToAccount(config.privateKey as Hex);

    this.wallet = createWalletClient({
      account: account,
      chain: sepolia,
      transport: http(),
    }).extend(publicActions);
  }

  /**
   * isENS available check if the given domain is available on ENS.
   * 
   * @param name Name of the ENS to check
   * @returns true if the address is available
   */
  async isENSAvailable(name: string): Promise<boolean> {
    try {
      const address = await this.wallet.getEnsAddress({
        name: normalize(name),
        coinType: ETH_COIN_TYPE,
      });

      if (!address) {
        return true
      }

      return false;
    } catch (error) {
      throw new Error("could not get ENS address", { cause: error });
    }
  }

  addBudalSuffix(name: string): string {
    return `${name}.budal.eth`;
  }

  /*
  async registerENSAddress(name: string): Promise<string> {
    try {
      
    } catch (error) {
      throw new Error("could not register ENS address", { cause: error });
    }

  }
  */
}
