# SimpleCrowdfund (`cfxcrowd.sol`)

A minimal crowdfunding smart contract written in Solidity.

This contract lets:
- anyone contribute CFX before a deadline
- the creator withdraw all funds if the funding goal is reached
- contributors claim refunds if the goal is not reached

---

## Contract File

- `cfxcrowd.sol`
- Contract name: `SimpleCrowdfund`
- Solidity version: `^0.8.20`

---

## How It Works

The contract stores:
- `creator`: deployer address
- `goal`: target amount (stored in wei)
- `deadline`: campaign end timestamp
- `totalRaised`: total contributions collected
- `contributions`: how much each address contributed

Main functions:
- `contribute()` - send CFX to fund the campaign (before deadline)
- `withdraw()` - creator withdraws contract balance (after deadline, if goal reached)
- `refund()` - contributors reclaim funds (after deadline, if goal not reached)

---

## Run on Remix (Step by Step)

### 1) Open Remix

Go to [https://remix.ethereum.org](https://remix.ethereum.org).

### 2) Create and paste contract

1. In Remix, create a new file named `cfxcrowd.sol`.
2. Paste the content of your local `cfxcrowd.sol` file.

### 3) Compile

1. Open **Solidity Compiler** tab.
2. Select compiler version `0.8.20` (or compatible `0.8.x`).
3. Click **Compile cfxcrowd.sol**.

You should see no compile errors.

### 4) Deploy

1. Open **Deploy & Run Transactions** tab.
2. Environment:
   - for local test: `Remix VM (Cancun)` (or latest VM)
   - for real network: `Injected Provider - MetaMask`
3. Select contract: `SimpleCrowdfund`.
4. Provide constructor params:
   - `_goalInCFX` (example: `10`)
   - `_durationInMinutes` (example: `5`)
5. Click **Deploy**.

This example creates a campaign with:
- goal = `10 CFX`
- duration = `5 minutes`

---

## Quick Test Flow in Remix

Use different accounts in Remix (or MetaMask) to test fully.

### A) Contribution test

1. Before deadline, call `contribute()`.
2. In Remix, set **Value** (example: `1`) and unit as `ether` (wei base).
3. Confirm transaction.
4. Verify:
   - `totalRaised` increases
   - `contributions(yourAddress)` increases

### B) Successful campaign path

1. Contribute enough so `totalRaised >= goal`.
2. Wait until deadline passes.
3. From creator account, call `withdraw()`.
4. Verify creator receives funds and contract balance becomes zero.

### C) Failed campaign path

1. Deploy a new campaign with higher goal (or contribute less).
2. Wait until deadline passes with `totalRaised < goal`.
3. Contributor calls `refund()`.
4. Verify refund amount equals that contributor's contribution.

---

## Important Notes

- Goal conversion: `_goalInCFX` is converted with `* 1e18`, so enter whole CFX in constructor.
- Time-based logic uses `block.timestamp`; exact second-level timing can vary slightly by network.
- `withdraw()` is only for creator and only after deadline with goal reached.
- `refund()` works only after deadline and only if goal was not reached.

---

## Example Constructor Inputs

- `_goalInCFX = 50`
- `_durationInMinutes = 60`

Meaning:
- Raise `50 CFX`
- Campaign lasts `1 hour`

---

## Security / Improvement Ideas

For learning this is good, but for production consider:
- add events (`Contributed`, `Withdrawn`, `Refunded`)
- add a reentrancy guard
- prefer low-level `call` instead of `transfer`
- add automated tests (Hardhat or Foundry)

---

## License

MIT (as declared in the contract SPDX header).
