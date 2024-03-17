export interface ContractCaller {
  walletID: string;
  userToken: string;
}

export type ExecuteOptions = {
  ABIFunctionSignature: string;
  ABIParameters: any[];
};

export interface OwnContractOptions {
  walletAddress: string;
}

export interface CreateGroupOptions {
  groupAddress: string;
  allocation: number;
  delays: number;
}

export interface AddUserToGroupOptions {
  groupAddress: string;
  userAddress: string;
}

export interface AddFoundOptions {
  groupAddress: string;
  amount: number;
}
