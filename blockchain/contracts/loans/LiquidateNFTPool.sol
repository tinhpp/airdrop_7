// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "../utils/Permission.sol";
import "./direct/loanTypes/IDirectLoanBase.sol";
import "../Marketplace.sol";

/**
 * @title  LiquidateNFTPool
 * @dev Implements base functionalities common to all Loan types.
 * Mostly related to governance and security.
 */ contract LiquidateNFTPool is Permission, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */
    address public loan;
    address public marketplace;

    event LoanPoolRegistration(address indexed account);
    event SetLoanPool(address indexed oldValue, address indexed newValue);
    event SetMarketplace(address indexed oldValue, address indexed newValue);
    event LiquidateNFT(
        bytes32 loanId,
        address indexed _erc20Token,
        uint256 amount,
        uint256 indexed nftId,
        uint256 timestamp,
        address indexed nftContract
    );

    /**
     * @notice Sets the admin of the contract.
     *
     * @param _admin - Initial admin of this contract.
     */
    constructor(address _admin, address _loan) {
        _transferOwnership(_admin);
        loan = _loan;
    }

    function setLoanPool(address _loan) external notZeroAddress(_loan) onlyOwner {
        address _oldValue = loan;
        loan = _loan;
        emit SetLoanPool(_oldValue, loan);
    }

    function setMarketplace(address _marketplace) external notZeroAddress(_marketplace) onlyOwner {
        address _oldValue = marketplace;
        marketplace = _marketplace;
        emit SetMarketplace(_oldValue, marketplace);
    }

    /* ********* */
    /* FUNCTIONS */
    /* ********* */

    function liquidateNFT(
        bytes32 _loanId,
        address _nftContract,
        uint256 _nftId,
        address _erc20Token,
        uint256 _amount
    ) external nonReentrant whenNotPaused {
        require(msg.sender == loan, "Only Loan can liquidate");
        Marketplace(marketplace).liquidate(_nftContract, _nftId, _amount);
        IERC721(_nftContract).safeTransferFrom(loan, marketplace, _nftId, "");

        // Emit an event with all relevant details from this transaction.
        emit LiquidateNFT(_loanId, _erc20Token, _amount, _nftId, block.timestamp, _nftContract);
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - Only the owner can call this method.
     * - The contract must not be paused.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - Only the owner can call this method.
     * - The contract must be paused.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
