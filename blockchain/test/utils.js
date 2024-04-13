const { ethers } = require("hardhat");

const { AddressZero: ZERO_ADDRESS, MaxUint256: MAX_UINT256 } = ethers.constants;

async function signatureData(taskId, users, rewards, nonce, privateKey) {
    const { chainId } = await ethers.provider.getNetwork();
    // 66 byte string, which represents 32 bytes of data
    let messageHash = encodeData(chainId, taskId, users, rewards, nonce);

    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);
    let wallet = new ethers.Wallet(privateKey);

    // To sign the 32 bytes of data, make sure you pass in the data
    const signature = await wallet.signMessage(messageHashBinary);
    return signature;
}

function encodeData(chainId, taskId, users, rewards, nonce) {
    const payload = ethers.utils.defaultAbiCoder.encode(["uint256", "uint256", "address[]", "uint256[]", "uint256"], [chainId, taskId, users, rewards, nonce]);
    return ethers.utils.keccak256(payload);
}

function getEncodeOffer(offer) {
    const { principalAmount, maximumRepaymentAmount, nftCollateralId, nftCollateralContract, duration, adminFeeInBasisPoints, erc20Denomination } = offer;
    const payload = ethers.utils.solidityPack(
        ["address", "uint256", "uint256", "address", "uint256", "uint32", "uint16"],
        [erc20Denomination, principalAmount, maximumRepaymentAmount, nftCollateralContract, nftCollateralId, duration, adminFeeInBasisPoints]
    );
    return payload;
}

function getEncodedSignature(signature) {
    const { signer, nonce, expiry } = signature;
    const payload = ethers.utils.solidityPack(["address", "uint256", "uint256"], [signer, nonce, expiry]);
    return payload;
}

function getMessage(encodedOffer, encodedSignature, loanContract, chainId) {
    const payload = ethers.utils.solidityPack(["bytes", "bytes", "address", "uint256"], [encodedOffer, encodedSignature, loanContract, chainId]);
    // return new TextEncoder("utf-8").encode(ethers.utils.keccak256(payload));
    return ethers.utils.arrayify(ethers.utils.keccak256(payload));
}

const getRandomInt = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

const getCurrentBlock = async () => {
    const latestBlock = await hre.ethers.provider.getBlock("latest");
    return latestBlock.number;
};

const skipBlock = async (blockNumber) => {
    for (let index = 0; index < blockNumber; index++) {
        await hre.ethers.provider.send("evm_mine");
    }
};

async function getTimestamp() {
    const latestBlock = await ethers.provider.getBlock("latest");
    return latestBlock.timestamp;
}

async function skipTime(seconds) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
}

module.exports = {
    getRandomInt,
    encodeData,
    getEncodeOffer,
    getEncodedSignature,
    getMessage,
    getCurrentBlock,
    skipBlock,
    getTimestamp,
    skipTime,
    ZERO_ADDRESS,
    MAX_UINT256,
};
