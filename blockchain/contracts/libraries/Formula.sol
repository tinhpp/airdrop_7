// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 *  @title  Formula
 *
 *  @notice Each function of this library is the implementation of a featured mathematical formula used in the system.
 */
library Formula {
    /* ******* */
    /* STORAGE */
    /* ******* */

    using SafeMath for uint256;
    uint256 public constant ONE = 1e18;

    /* ****************** */
    /* INTERNAL FUNCTIONS */
    /* ****************** */

    /**
     *  @notice Calculate the accumulated interest rate in the staking pool when an amount of staking reward is emitted.
     *          Formula:    P * (1 + r / a)
     *          Type:       dec
     *          Usage:      StakingPool
     *
     *          Name                    Symbol  Type    Meaning
     *  @param  _productOfInterestRate  P       int     Accumulated interest rate in the staking pool
     *  @param  _reward                 r       int     Staking reward
     *  @param  _totalCapital           a       int     Total staked capital
     */
    function newProductOfInterestRate(
        uint256 _productOfInterestRate,
        uint256 _reward,
        uint256 _totalCapital
    ) internal pure returns (uint256 res) {
        uint256 interestRate = ONE.add(_reward.mul(ONE).div(_totalCapital));
        res = _productOfInterestRate.mul(interestRate).div(ONE);
    }
}
