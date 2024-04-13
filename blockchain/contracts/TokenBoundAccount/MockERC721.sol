// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Character is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIds;

    constructor() ERC721("Character", "CHAR") {}

    function mint(address _to, string memory _uri) external {
        tokenIds.increment();
        _safeMint(_to, tokenIds.current());
        _setTokenURI(tokenIds.current(), _uri);
    }
}
