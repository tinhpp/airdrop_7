// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./NFTfiSigningUtils.sol";

/**
 * @title  NFTfiSigningUtilsContract
 * @notice Helper contract for Loan. This contract manages externally verifying signatures from off-chain Loan orders.
 */
contract NFTfiSigningUtilsContract {
    /* ********* */
    /* FUNCTIONS */
    /* ********* */

    /**
     * @notice This function is when the borrower accepts a lender's offer, to validate the lender's signature that the
     * lender provided off-chain to verify that it did indeed made such offer.
     *
     * @param _offer - The offer struct containing:
     * - erc20Denomination: The address of the ERC20 contract of the currency being used as principal/interest
     * for this loan.
     * - principalAmount: The original sum of money transferred from lender to borrower at the beginning of
     * the loan, measured in erc20Denomination's smallest units.
     * - maximumRepaymentAmount: The maximum amount of money that the borrower would be required to retrieve their
     * collateral, measured in the smallest units of the ERC20 currency used for the loan. The borrower will always have
     * to pay this amount to retrieve their collateral, regardless of whether they repay early.
     * - nftCollateralContract: The address of the ERC721 contract of the NFT collateral.
     * - nftCollateralId: The ID within the NFTCollateralContract for the NFT being used as collateral for this
     * loan. The NFT is stored within this contract during the duration of the loan.
     * - referrer: The address of the referrer who found the lender matching the listing, Zero address to signal
     * this there is no referrer.
     * - duration: The amount of time (measured in seconds) that can elapse before the lender can liquidate the
     * loan and seize the underlying collateral NFT.
     * - adminFeeInBasisPoints: The percent (measured in basis points) of the interest earned that will be
     * taken as a fee by the contract admins when the loan is repaid. The fee is stored in the loan struct to prevent an
     * attack where the contract admins could adjust the fee right before a loan is repaid, and take all of the interest
     * earned.
     * @param _signature - The signature structure containing:
     * - signer: The address of the signer. The borrower for `acceptOffer` the lender for `acceptListing`.
     * - nonce: The nonce referred here is not the same as an Ethereum account's nonce.
     * We are referring instead to a nonce that is used by the lender or the borrower when they are first signing
     * off-chain Loan orders. These nonce can be any uint256 value that the user has not previously used to sign an
     * off-chain order. Each nonce can be used at most once per user within Loan, regardless of whether they are the
     * lender or the borrower in that situation. This serves two purposes:
     *   - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     *   - Second, it allows a user to cancel an off-chain order by calling
     * Loan.cancelLoanCommitmentBeforeLoanHasBegun(), which marks the nonce as used and prevents any future loan from
     * using the user's off-chain order that contains that nonce.
     * - expiry: Date when the signature expires
     * - signature: The ECDSA signature of the lender, obtained off-chain ahead of time, signing the following
     * combination of parameters:
     *   - offer.erc20Denomination
     *   - offer.principalAmount
     *   - offer.maximumRepaymentAmount
     *   - offer.nftCollateralContract
     *   - offer.nftCollateralId
     *   - offer.duration
     *   - offer.adminFeeInBasisPoints
     *   - signature.signer,
     *   - signature.nonce,
     *   - signature.expiry,
     *   - loan contract address,
     *   - chainId
     * @param _loanContract - Address of the loan contract where the signature is going to be used
     */
    function isValidLenderSignature(
        LoanData.Offer memory _offer,
        LoanData.Signature memory _signature,
        address _loanContract
    ) external view returns (bool) {
        return NFTfiSigningUtils.isValidLenderSignature(_offer, _signature, _loanContract);
    }

    /**
     * @notice This function is called in renegotiateLoan() to validate the lender's signature that the lender provided
     * off-chain to verify that they did indeed want to agree to this loan renegotiation according to these terms.
     *
     * @param _loanId - The unique identifier for the loan to be renegotiated
     * @param _newLoanDuration - The new amount of time (measured in seconds) that can elapse before the lender can
     * liquidate the loan and seize the underlying collateral NFT.
     * @param _newMaximumRepaymentAmount - The new maximum amount of money that the borrower would be required to
     * retrieve their collateral, measured in the smallest units of the ERC20 currency used for the loan. The
     * borrower will always have to pay this amount to retrieve their collateral, regardless of whether they repay
     * early.
     * @param _renegotiationFee Agreed upon fee in ether that borrower pays for the lender for the renegitiation
     * @param _signature - The signature structure containing:
     * - signer: The address of the signer. The borrower for `acceptOffer` the lender for `acceptListing`.
     * - nonce: The nonce referred here is not the same as an Ethereum account's nonce.
     * We are referring instead to a nonce that is used by the lender or the borrower when they are first signing
     * off-chain Loan orders. These nonce can be any uint256 value that the user has not previously used to sign an
     * off-chain order. Each nonce can be used at most once per user within Loan, regardless of whether they are the
     * lender or the borrower in that situation. This serves two purposes:
     * - First, it prevents replay attacks where an attacker would submit a user's off-chain order more than once.
     * - Second, it allows a user to cancel an off-chain order by calling Loan.cancelLoanCommitmentBeforeLoanHasBegun()
     * , which marks the nonce as used and prevents any future loan from using the user's off-chain order that contains
     * that nonce.
     * - expiry - The date when the renegotiation offer expires
     * - lenderSignature - The ECDSA signature of the lender, obtained off-chain ahead of time, signing the
     * following combination of parameters:
     * - _loanId
     * - _newLoanDuration
     * - _newMaximumRepaymentAmount
     * - _lender
     * - _lenderNonce
     * - _expiry
     *  - loan contract address,
     * - chainId
     * @param _loanContract - Address of the loan contract where the signature is going to be used
     */
    function isValidLenderRenegotiationSignature(
        bytes32 _loanId,
        uint32 _newLoanDuration,
        uint256 _newMaximumRepaymentAmount,
        uint256 _renegotiationFee,
        LoanData.Signature memory _signature,
        address _loanContract
    ) external view returns (bool) {
        return
            NFTfiSigningUtils.isValidLenderRenegotiationSignature(
                _loanId,
                _newLoanDuration,
                _newMaximumRepaymentAmount,
                _renegotiationFee,
                _signature,
                _loanContract
            );
    }
}
