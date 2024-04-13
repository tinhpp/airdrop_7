const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();
const env = process.env;

const BASE_URI = 'https://chonksociety.s3.us-east-2.amazonaws.com/metadata/'

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

    //* Loading contract factory */
    const PermittedNFTs = await ethers.getContractFactory("PermittedNFTs");
    const LoanChecksAndCalculations = await hre.ethers.getContractFactory('LoanChecksAndCalculations');
    const NFTfiSigningUtils = await hre.ethers.getContractFactory('NFTfiSigningUtils');
    const LendingPool = await ethers.getContractFactory("LendingPoolV3");
    const WXCR = await ethers.getContractFactory("WXCR");
    const Chonk = await ethers.getContractFactory("ChonkSociety");
    const LiquidateNFTPool = await ethers.getContractFactory("LiquidateNFTPool");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    const treasury = "0x4F9EF07A6DDF73494D2fF51A8f7B78e9c5815eb2";

    let loanChecksAndCalculations = await LoanChecksAndCalculations.deploy();
    console.log("Library LoanChecksAndCalculations deployed to:", loanChecksAndCalculations.address);
    await loanChecksAndCalculations.deployed()

    let nftfiSigningUtils = await NFTfiSigningUtils.deploy();
    console.log("Library NFTfiSigningUtils deployed to:", nftfiSigningUtils.address);
    await nftfiSigningUtils.deployed()

    const permittedNFTs = await PermittedNFTs.deploy(accounts[0].address);
    console.log("PermittedNFTs                        deployed to:>>", permittedNFTs.address);
    await permittedNFTs.deployed();

    const liquidateNFTPool = await LiquidateNFTPool.deploy(accounts[0].address);
    console.log("LiquidateNFTPool                        deployed to:>>", liquidateNFTPool.address);
    await liquidateNFTPool.deployed();

    const wXCR = await WXCR.deploy();
    console.log("WXCR                        deployed to:>>", wXCR.address);
    await wXCR.deployed();

    const chonk = await Chonk.deploy(BASE_URI);
    console.log("chonk                        deployed to:>>", chonk.address);
    await chonk.deployed();

    // const loanChecksAndCalculations = LoanChecksAndCalculations.attach("0xF46E912d82e49104d332D69c2A9E1Aa0B7440892");
    // const nftfiSigningUtils = NFTfiSigningUtils.attach("0x4A0c460a775404B87674E2fBff48CA6607b7fBB3");
    // const permittedNFTs = await PermittedNFTs.attach("0xd17beddb48e6d29a8798845fcca341566669db13");
    // const wXCR = WXCR.attach("0x3b3f35c81488c49b370079fd05cfa917c83a38a9");
    // const chonk = Chonk.attach("0x25baf69a46923c0db775950b0ef96e6018343a36")

    const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
        libraries: {
            LoanChecksAndCalculations: loanChecksAndCalculations.address,
            NFTfiSigningUtils: nftfiSigningUtils.address
        },
    });

    const lendingPool = await LendingPool.deploy(wXCR.address, treasury, "10000000000000000000", 0);
    console.log("LendingPool                     deployed to:>>", lendingPool.address);
    await lendingPool.deployed();


    const directLoanFixedOffer = await DirectLoanFixedOffer.deploy(accounts[0].address, lendingPool.address, liquidateNFTPool.address, permittedNFTs.address, [wXCR.address]);
    console.log("DirectLoanFixedOffer                        deployed to:>>", directLoanFixedOffer.address);
    await directLoanFixedOffer.deployed();

    // const lendingPool = await LendingPool.attach("0x232980756de30016b6a48ed73cacc7b2a0b27959");
    console.log("========= LENDING POOL TRANSACTION ===========")
    await lendingPool.approve(directLoanFixedOffer.address, ethers.constants.MaxUint256);

    console.log("========= permittedNFTs TRANSACTION ===========")
    await permittedNFTs.setNFTPermit(chonk.address, true)

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
