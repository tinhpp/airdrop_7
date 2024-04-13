// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/**
 *  @title  Lending Pool Interface
 *
 */
interface ILendingPool {
    function treasury() external view returns (address);
}
