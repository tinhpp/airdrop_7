const { ethers } = require("hardhat");

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];

    //* Loading contract factory */
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const LiquidateNFTPool = await ethers.getContractFactory("LiquidateNFTPool");
    const NFT = await ethers.getContractFactory("MockERC721");
    const WXCR = await ethers.getContractFactory("WXCR");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");
    const wXCR = "0x747ae7Dcf3Ea10D242bd17bA5dfA034ca6102108";
    const marketPercent = 10;
    const marketplace = await Marketplace.deploy(wXCR, marketPercent);
    await marketplace.deployed();
    console.log("Marketplace                        deployed to:>>", marketplace.address);

    const loan = "0xc3facdeb05cba22b01114a099693316d73d51d4d";
    const liquidateNFTPool = await LiquidateNFTPool.deploy(deployer.address, loan);
    await liquidateNFTPool.deployed();
    console.log("LiquidateNFTPool                   deployed to:>>", liquidateNFTPool.address);

    // await liquidateNFTPool.setMarketplace(marketplace.address);
    // await marketplace.setLiquidateNFTPool(liquidateNFTPool.address);

    console.log("==========================================================================");
    console.log("DONE");
    console.log("==========================================================================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
