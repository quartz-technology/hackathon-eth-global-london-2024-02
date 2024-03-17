# Budal Smart Contract

The Budal Smart Contract contains the core logic of the project to manage organisation and sub-organisations funds.

## Quickstart

### Requirements

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Install dependencies

```bash
forge install OpenZeppelin/openzeppelin-contracts
```
we use the IERC20 from OpenZeppelin to integrate payment in token

### build the project

```bash
forge build
```

### Deploy the contract

we recommend to deploy the contract on Sepolia, because we use the USDC ERC20 token address from the Sepolia network
as a reference in the `Intermediate.sol` contract.

```bash
forge create --rpc-url <Rpc Url> --private-key <Private Key> src/Intermediate.sol:Intermediate
```

## Documentation

The contract is documented, explore the code to see it :)

Made with ❤️ by [Quartz](https://www.quartz.technology/)