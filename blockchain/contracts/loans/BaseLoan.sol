// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "../utils/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title  BaseLoan
 * @dev Implements base functionalities common to all Loan types.
 * Mostly related to governance and security.
 */
abstract contract BaseLoan is Ownable, Pausable, ReentrancyGuard {
    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */

    /**
     * @notice Sets the admin of the contract.
     *
     * @param _admin - Initial admin of this contract.
     */
    constructor(address _admin) Ownable(_admin) {
        // solhint-disable-previous-line no-empty-blocks
    }

    /* ****************** */
    /* EXTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice Triggers stopped state.
     *
     * @dev Only the owner can call this method.
     *      The contract must not be paused.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Returns to normal state.
     *
     * @dev Only the owner can call this method.
     *      The contract must be paused.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
