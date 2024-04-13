// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

/**
 * @title IPermittedNFTs
 * @dev PermittedNFTs interface
 */
interface IPermittedNFTs {
    function getNFTPermit(address _nftContract) external view returns (bool);
}
