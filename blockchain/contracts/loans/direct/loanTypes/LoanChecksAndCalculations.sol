// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./IDirectLoanBase.sol";
import "./LoanData.sol";
import "../../../interfaces/IPermittedERC20s.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title  LoanChecksAndCalculations
 * @notice Helper library for LoanBase
 */
library LoanChecksAndCalculations {
    /* ******* */
    /* STORAGE */
    /* ******* */
    uint16 private constant HUNDRED_PERCENT = 10000;

    /* ********* */
    /* FUNCTIONS */
    /* ********* */

    /**
     * @notice Function that performs some validation checks before trying to repay a loan
     * @dev Everyone can call
     * @param _loanId - The id of the loan being repaid
     */
    function payBackChecks(bytes32 _loanId) external view {
        checkLoanIdValidity(_loanId);
        // Sanity check that payBackLoan() and liquidateOverdueLoan() have never been called on this loanId.
        // Depending on how the rest of the code turns out, this check may be unnecessary.
        require(!IDirectLoanBase(address(this)).loanRepaidOrLiquidated(_loanId), "Loan already repaid/liquidated");

        // Fetch loan details from storage, but store them in memory for the sake of saving gas.
        (, , , , uint32 duration, , uint64 loanStartTime, , , , ) = IDirectLoanBase(address(this)).loanIdToLoan(
            _loanId
        );

        // When a loan exceeds the loan term, it is expired. At this stage the Lender can call Liquidate Loan to resolve
        // the loan.
        require(block.timestamp <= (uint256(loanStartTime) + uint256(duration)), "Loan is expired");
    }

    /**
     * @notice check loan's id is valid or not
     * @dev Everyone can call
     * @param _loanId Id of loan
     */
    function checkLoanIdValidity(bytes32 _loanId) public view {
        require(IDirectLoanBase(address(this)).isValidLoanId(_loanId), "invalid loanId");
    }

    /**
     * @dev Performs some validation checks before trying to renegotiate a loan.
     * Needed to avoid stack too deep.
     *
     * @param _loan - The main Loan Terms struct.
     * @param _loanId - The unique identifier for the loan to be renegotiated
     * @param _newLoanDuration - The new amount of time (measured in seconds) that can elapse before the lender can
     * liquidate the loan and seize the underlying collateral NFT.
     * @param _newMaximumRepaymentAmount - The new maximum amount of money that the borrower would be required to
     * retrieve their collateral, measured in the smallest units of the ERC20 currency used for the loan. The
     * borrower will always have to pay this amount to retrieve their collateral, regardless of whether they repay
     * early.
     * @param _lenderNonce - The nonce referred to here is not the same as an Ethereum account's nonce. We are
     * referring instead to nonces that are used by both the lender and the borrower when they are first signing
     * off-chain Loan orders. These nonces can be any uint256 value that the user has not previously used to sign an
     * off-chain order. Each nonce can be used at most once per user within Loan, regardless of whether they are the
     * lender or the borrower in that situation. This serves two purposes:
     * - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     * - Second, it allows a user to cancel an off-chain order by calling Loan.cancelLoanCommitmentBeforeLoanHasBegun()
     , which marks the nonce as used and prevents any future loan from using the user's off-chain order that contains
     * that nonce.
     * @return Borrower and Lender addresses
     */
    function renegotiationChecks(
        LoanData.LoanTerms memory _loan,
        bytes32 _loanId,
        uint32 _newLoanDuration,
        uint256 _newMaximumRepaymentAmount,
        uint256 _lenderNonce
    ) external view returns (address, address) {
        checkLoanIdValidity(_loanId);
        require(msg.sender == _loan.borrower, "Only borrower can initiate");
        require(block.timestamp <= (uint256(_loan.loanStartTime) + _newLoanDuration), "New duration already expired");
        require(
            uint256(_newLoanDuration) <= IDirectLoanBase(address(this)).maximumLoanDuration(),
            "New duration exceeds maximum loan duration"
        );
        require(!IDirectLoanBase(address(this)).loanRepaidOrLiquidated(_loanId), "Loan already repaid/liquidated");
        require(_newMaximumRepaymentAmount >= _loan.principalAmount, "Negative interest rate loans are not allowed.");

        require(
            !IDirectLoanBase(address(this)).getWhetherNonceHasBeenUsedForUser(_loan.lender, _lenderNonce),
            "Lender nonce invalid"
        );

        return (_loan.borrower, _loan.lender);
    }

    /**
     * @dev Performs some validation checks over loan parameters when accepting a listing
     *
     */
    function bindingTermsSanityChecks(
        LoanData.ListingTerms memory _listingTerms,
        LoanData.Offer memory _offer
    ) external pure {
        // offer vs listing validations
        require(_offer.erc20Denomination == _listingTerms.erc20Denomination, "Invalid erc20Denomination");
        require(
            _offer.principalAmount >= _listingTerms.minLoanPrincipalAmount &&
                _offer.principalAmount <= _listingTerms.maxLoanPrincipalAmount,
            "Invalid principalAmount"
        );
        uint256 maxRepaymentLimit = _offer.principalAmount +
            (_offer.principalAmount * _listingTerms.maxInterestRateForDurationInBasisPoints) /
            HUNDRED_PERCENT;
        require(_offer.maximumRepaymentAmount <= maxRepaymentLimit, "maxInterestRateForDurationInBasisPoints violated");

        require(
            _offer.duration >= _listingTerms.minLoanDuration && _offer.duration <= _listingTerms.maxLoanDuration,
            "Invalid duration"
        );
    }

    /**
     * @notice A convenience function computing the revenue share taken from the admin fee to transferr to the permitted
     * partner.
     *
     * @param _adminFee - The quantity of ERC20 currency (measured in smalled units of that ERC20 currency) that is due
     * as an admin fee.
     * @param _revenueShareInBasisPoints - The percent (measured in basis points) of the admin fee amount that will be
     * taken as a revenue share for a the partner, at the moment the loan is begun.
     *
     * @return The quantity of ERC20 currency (measured in smalled units of that ERC20 currency) that should be sent to
     * the `revenueSharePartner`.
     */
    function computeRevenueShare(
        uint256 _adminFee,
        uint256 _revenueShareInBasisPoints
    ) external pure returns (uint256) {
        return (_adminFee * _revenueShareInBasisPoints) / HUNDRED_PERCENT;
    }

    /**
     * @notice A convenience function computing the adminFee taken from a specified quantity of interest.
     *
     * @param _interestDue - The amount of interest due, measured in the smallest quantity of the ERC20 currency being
     * used to pay the interest.
     * @param _adminFeeInBasisPoints - The percent (measured in basis points) of the interest earned that will be taken
     * as a fee by the contract admins when the loan is repaid. The fee is stored in the loan struct to prevent an
     * attack where the contract admins could adjust the fee right before a loan is repaid, and take all of the interest
     * earned.
     *
     * @return The quantity of ERC20 currency (measured in smalled units of that ERC20 currency) that is due as an admin
     * fee.
     */
    function computeAdminFee(uint256 _interestDue, uint256 _adminFeeInBasisPoints) external pure returns (uint256) {
        return (_interestDue * _adminFeeInBasisPoints) / HUNDRED_PERCENT;
    }

    /**
     * @notice A convenience function computing the referral fee taken from the loan principal amount to transferr to
     * the referrer.
     *
     * @param _loanPrincipalAmount - The original sum of money transferred from lender to borrower at the beginning of
     * the loan, measured in erc20Denomination's smallest units.
     * @param _referralFeeInBasisPoints - The percent (measured in basis points) of the loan principal amount that will
     * be taken as a fee to pay to the referrer, 0 if the lender is not paying referral fee.
     * @param _referrer - The address of the referrer who found the lender matching the listing, Zero address to signal
     * that there is no referrer.
     *
     * @return The quantity of ERC20 currency (measured in smalled units of that ERC20 currency) that should be sent to
     * the referrer.
     */
    function computeReferralFee(
        uint256 _loanPrincipalAmount,
        uint256 _referralFeeInBasisPoints,
        address _referrer
    ) external pure returns (uint256) {
        if (_referralFeeInBasisPoints == 0 || _referrer == address(0)) {
            return 0;
        }
        return (_loanPrincipalAmount * _referralFeeInBasisPoints) / HUNDRED_PERCENT;
    }
}
