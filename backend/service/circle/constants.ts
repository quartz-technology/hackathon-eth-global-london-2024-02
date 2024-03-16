// Workaround because Blockchain and AccountType are not exported by
// @circle-fin/user-controlled-wallets

// Copied from circle-fin/user-controlled-wallets/dist/types/clients/user-controlled-wallets.d.ts#L194
export enum Blockchain {
	EthGoerli = 'ETH-GOERLI',
	EthSepolia = 'ETH-SEPOLIA',
	Eth = 'ETH',
	AvaxFuji = 'AVAX-FUJI',
	Avax = 'AVAX',
	MaticMumbai = 'MATIC-MUMBAI',
	Matic = 'MATIC',
}

// Copied from circle-fin/user-controlled-wallets/dist/types/clients/user-controlled-wallets.d.ts#L178
export enum AccountType {
	Sca = 'SCA',
	Eoa = 'EOA',
}

export const CircleAPIBaseURL = "https://api.circle.com/v1/w3s/user";