// Workaround because Blockchain and AccountType are not exported by
// @circle-fin/user-controlled-wallets
export enum Blockchain {
	EthGoerli = 'ETH-GOERLI',
	EthSepolia = 'ETH-SEPOLIA',
	Eth = 'ETH',
	AvaxFuji = 'AVAX-FUJI',
	Avax = 'AVAX',
	MaticMumbai = 'MATIC-MUMBAI',
	Matic = 'MATIC',
}

export enum AccountType {
	Sca = 'SCA',
	Eoa = 'EOA',
}
