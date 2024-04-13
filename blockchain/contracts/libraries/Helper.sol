// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.18;

library Helper {

    /**
     * @notice Transfer native token to user
     * @param _to Address of receiver
     * @param _value Amount of native token will be transferred
     */
    function safeTransferNative(address _to, uint256 _value) internal {
        (bool success, ) = _to.call{value: _value}(new bytes(0));
        require(success, "SafeTransferNative: transfer failed");
    }
}
