// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Weapon is ERC721URIStorage {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    /**
     * @notice Token Id
     */
    Counters.Counter public tokenIds;

    /**
     * @dev List token id of owner
     */
    mapping(address => EnumerableSet.UintSet) _tokensOfOwner;

    constructor() ERC721("Weapon", "Weapon") {}

    function mint(address _to, string memory _uri) external {
        tokenIds.increment();
        _safeMint(_to, tokenIds.current());
        _setTokenURI(tokenIds.current(), _uri);
        _tokensOfOwner[_msgSender()].add(tokenIds.current());
    }

    /* ************* */
    /* VIEW FUNCTIONS */
    /* ************* */

    /**
     * @notice Get list tokens of an owner
     * @dev Everyone can call
     * @param _owner Address of owner
     * @return nfts list of owner's nfts
     */
    function tokensOfOwner(address _owner) external view returns (uint256[] memory) {
        return _tokensOfOwner[_owner].values();
    }

    /* ***************** */
    /* INTERNAL FUNCTIONS */
    /* ***************** */

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        if (from != address(0) && to != address(0)) {
            _tokensOfOwner[from].remove(firstTokenId);
            _tokensOfOwner[to].add(firstTokenId);
        }

        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
}
