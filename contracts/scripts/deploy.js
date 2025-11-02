const hre = require("hardhat");

async function main() {
  console.log("Deploying ComicBookNFT contract...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const ComicBookNFT = await hre.ethers.getContractFactory("ComicBookNFT");
  const comicBookNFT = await ComicBookNFT.deploy(deployer.address);

  await comicBookNFT.waitForDeployment();

  const contractAddress = await comicBookNFT.getAddress();
  console.log("ComicBookNFT deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  console.log("\nDeployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for block confirmations if not on hardhat network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await comicBookNFT.deploymentTransaction().wait(6);
    console.log("Confirmed!");

    // Verify contract on Etherscan if API key is available
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\nVerifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [deployer.address],
        });
        console.log("Contract verified!");
      } catch (error) {
        console.log("Verification error:", error.message);
      }
    }
  }

  console.log("\nSetup complete!");
  console.log("Update your backend .env file with:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
