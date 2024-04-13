const { ethers } = require("hardhat");

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    console.log("==========================================================================");
    console.log("ACCOUNTS:");
    console.log("==========================================================================");
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        console.log(` Account ${i}: ${account.address}`);
    }

    const MockERC721 = await ethers.getContractFactory("Weapon");
    const mockERC721 = await MockERC721.deploy();
    console.log("mockERC721", mockERC721.address);

    const TokenBoundAccount = await ethers.getContractFactory("TokenBoundAccount");
    const tokenBoundAccount = await TokenBoundAccount.deploy();
    console.log("tokenBoundAccount", tokenBoundAccount.address);

    const TokenBoundAccountRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");
    const tokenBoundAccountRegistry = await TokenBoundAccountRegistry.deploy();
    console.log("tokenBoundAccountRegistry", tokenBoundAccountRegistry.address);

    const Weapon = await ethers.getContractFactory("Weapon");
    const weapon = await Weapon.deploy();
    console.log("weapon", weapon.address);
    await weapon.deployed();

    for (let i = 1; i < 5; i++) {
        const BASE_URI = `https://res.cloudinary.com/htphong02/raw/upload/v1689756298/metadata/weapons/${i}.json`;
        let tx = await weapon.connect(accounts[0]).mint(accounts[0].address, BASE_URI);
        console.log("mint", i, tx.hash);
        await tx.wait();
        tx = await weapon.connect(accounts[0]).transferFrom(accounts[0].address, "0x2221C6C1dd592b9dffCeA63F5199F99B900C486b", i);
        console.log("transfer", i, tx.hash);
        await tx.wait();
    }

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
