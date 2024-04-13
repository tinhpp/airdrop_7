// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/Create2.sol";

import "../interfaces/ITokenBoundAccountRegistry.sol";
import "../libraries/TokenBoundAccountBytecodeLib.sol";

contract TokenBoundAccountRegistry is ITokenBoundAccountRegistry {
    error InitializationFailed();

    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt
    ) external returns (address) {
        bytes memory code = TokenBoundAccountBytecodeLib.getCreationCode(
            implementation,
            chainId,
            tokenContract,
            tokenId,
            salt
        );

        address _account = Create2.computeAddress(bytes32(salt), keccak256(code));

        if (_account.code.length != 0) return _account;

        emit AccountCreated(_account, implementation, chainId, tokenContract, tokenId, salt);

        _account = Create2.deploy(0, bytes32(salt), code);

        return _account;
    }

    function account(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt
    ) external view returns (address) {
        bytes32 bytecodeHash = keccak256(
            TokenBoundAccountBytecodeLib.getCreationCode(implementation, chainId, tokenContract, tokenId, salt)
        );

        return Create2.computeAddress(bytes32(salt), bytecodeHash);
    }
}
