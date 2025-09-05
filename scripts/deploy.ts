async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const cinToken = await ethers.deployContract("CINToken", [deployer.address]);

  console.log("CINToken deployed to:", await cinToken.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
