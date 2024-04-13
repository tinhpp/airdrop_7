// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721("MockERC721", "ERC721") {
    uint256 public lastId;

    function mint(address _to) external {
        _mint(_to, ++lastId);
    }
}
