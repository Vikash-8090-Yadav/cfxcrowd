import hre from "hardhat";

/**
 * Deploy SimpleCrowdfund.
 *
 * Constructor: (_goalInCFX, _durationInMinutes) — same as cfxcrowd.sol / Remix.
 *
 * Env (optional, defaults shown):
 *   GOAL_CFX=10
 *   DURATION_MINUTES=60
 */
async function main() {
  const { ethers, network } = hre;

  const goalCFX = BigInt(process.env.GOAL_CFX ?? "10");
  const durationMinutes = BigInt(process.env.DURATION_MINUTES ?? "60");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Network:", network.name);

  const Factory = await ethers.getContractFactory("SimpleCrowdfund");
  const crowdfund = await Factory.deploy(goalCFX, durationMinutes);
  await crowdfund.waitForDeployment();

  const address = await crowdfund.getAddress();
  console.log("SimpleCrowdfund deployed to:", address);
  console.log("  goal (CFX whole units):", goalCFX.toString());
  console.log("  duration (minutes):", durationMinutes.toString());
  console.log("  on-chain goal (wei):", (await crowdfund.goal()).toString());
  console.log("  deadline (unix):", (await crowdfund.deadline()).toString());
  console.log("");
  console.log("Frontend: set NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
