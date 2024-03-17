import { createWalletClient, http, publicActions, type Hex, type WalletClient, getContract, type Address, namehash } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { normalize } from "viem/ens";

import NameWrapperAbi from "@ensdomains/ens-contracts/artifacts/contracts/wrapper/NameWrapper.sol/NameWrapper.json";

import config from "@config";

const ETH_COIN_TYPE = 60;
const ENS_ADDRESS = "0x0635513f179D50A207757E05759CbD106d7dFcE8";

const ENS_EXPIRATION = 2021232060;
const ENS_RESOLVER = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD"

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
        return true;
      }

      return false;
    } catch (error) {
      throw new Error("could not get ENS address", { cause: error });
    }
  }

  addBudalSuffix(name: string): string {
    return `${name}.budal.eth`;
  }

  async registerENSAddress(name: string, walletAddress: string): Promise<void> {
    try {
      const contract = getContract({
        address: ENS_ADDRESS as Address,
        abi: NameWrapperAbi.abi,
        client: this.wallet,
      });

      console.log(namehash("budal.eth"), name, walletAddress, 0, 0, ENS_RESOLVER, ENS_EXPIRATION,)

      await contract.write.setSubnodeRecord([namehash("budal.eth"), name, walletAddress, ENS_RESOLVER, 0, 0, ENS_EXPIRATION]);
    } catch (error) {
      throw new Error("could not register ENS address", { cause: error });
    }
  }
}
