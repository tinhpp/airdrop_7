// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockERC1155 is ERC1155("https://ipfs/.json") {
    uint256 public lastId;

    function mint(address _to, uint256 _amount) external {
        _mint(_to, ++lastId, _amount, "");
    }
}
