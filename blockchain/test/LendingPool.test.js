const { ethers } = require("hardhat");
const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { MaxUint256 } = require("@ethersproject/constants");

const ONE_ETHER = parseEther('1');
const rewardPerBlock = parseEther('10');
const startBlock = 0;

describe("LendingPoolV3", () => {
    beforeEach(async () => {
        //** Get Wallets */
        [user1, user2, user3, treasury] = await ethers.getSigners();

        //** Get Contracts */
        const LendingPoolV3 = await ethers.getContractFactory("LendingPoolV3");
        const WXCR = await ethers.getContractFactory("WXCR");

        wXCR = await WXCR.deploy();
        await wXCR.mint(user1.address, ONE_ETHER.mul(1000));
        await wXCR.mint(user2.address, ONE_ETHER.mul(1000));
        await wXCR.mint(user3.address, ONE_ETHER.mul(1000));
        await wXCR.mint(treasury.address, ONE_ETHER.mul(1000));

        lendingPool = await LendingPoolV3.deploy(
            wXCR.address,
            treasury.address,
            rewardPerBlock,
            startBlock
        );

        await wXCR.connect(user1).approve(lendingPool.address, MaxUint256);
        await wXCR.connect(user2).approve(lendingPool.address, MaxUint256);
        await wXCR.connect(user3).approve(lendingPool.address, MaxUint256);
        await wXCR.connect(treasury).approve(lendingPool.address, MaxUint256);
    });

    describe("test share reward", () => {
        it("Should successfully`", async () => {
            await lendingPool.connect(user1).deposit(parseEther('100'));
            
            for (let i = 0; i < 10; i++) {
                const poolInfo = await lendingPool.poolInfo();
                console.log("Total Reward", formatEther(await lendingPool.rewardSupply(), 2))
                console.log("User 1 reward", formatEther(await lendingPool.pendingReward(user1.address), 2))
                console.log("User 2 reward", formatEther(await lendingPool.pendingReward(user2.address), 2))
                console.log("========================================")
                await lendingPool.connect(user2).deposit(parseEther('100'));
                if (i === 0) {
                    const balanceBefore = await wXCR.balanceOf(treasury.address);
                    await lendingPool.connect(user1).claimReward();
                    const balanceAfter = await wXCR.balanceOf(treasury.address);

                    console.log("balanceBefore", balanceBefore.toString());
                    console.log("balanceAfter", balanceAfter.toString());
                }
            }

            const addressLength = await lendingPool.addressLength();
            const addressByIndex = await lendingPool.getAddressByIndex(0);
            const allAddress = await lendingPool.getAllAddress();

            console.log("allAddress", allAddress)
            console.log("addressByIndex", addressByIndex)
            console.log("addressLength", addressLength)
        });

       
    });

});
