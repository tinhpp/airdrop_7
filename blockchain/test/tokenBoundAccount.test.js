const { ethers } = require("hardhat");
const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { MaxUint256 } = require("@ethersproject/constants");

describe.only("Token Bound Account", () => {
    beforeEach(async () => {
        //** Get Wallets */
        [user1, user2, user3, treasury] = await ethers.getSigners();

        const MockERC721 = await ethers.getContractFactory("Weapon");
        mockERC721 = await MockERC721.deploy();

        const TokenBoundAccount = await ethers.getContractFactory("TokenBoundAccount");
        tokenBoundAccount = await TokenBoundAccount.deploy();

        const TokenBoundAccountRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");
        tokenBoundAccountRegistry = await TokenBoundAccountRegistry.deploy();
    });

    it("", async () => {
        await mockERC721.connect(user1).mint(user1.address, "");
        const tx = await tokenBoundAccountRegistry.createAccount(tokenBoundAccount.address, 31337, mockERC721.address, 1, 200);
        console.log(tx);
    });
});
