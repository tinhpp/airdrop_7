// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract ChonkSociety is ERC721URIStorage {
    using Strings for uint256;
    using EnumerableSet for EnumerableSet.UintSet;
    using Counters for Counters.Counter;

    /* ******* */
    /* STORAGE */
    /* ******* */

    /**
     * @notice base extension for metadata URI
     */
    string public constant baseExtension = ".json";

    /**
     * @notice Token Id
     */
    Counters.Counter public tokenIds;

    /**
     * @notice base URI for metadata
     */
    string public baseURI = "";

    /**
     * @dev List token id of owner
     */
    mapping(address => EnumerableSet.UintSet) _tokensOfOwner;

    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */

    /**
     * @notice null Constructor
     * @param _baseURI Base URI of NFT
     */
    constructor(string memory _baseURI) ERC721("Chonk Society", "CHONK") {
        baseURI = _baseURI;
    }

    /* ****************** */
    /* EXTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice Mint new NFT
     * @dev Everyone can call
     * @param _to Address will be received NFT
     * @param _amount Amount NFT that address will be received
     */
    function mint(address _to, uint256 _amount) external {
        for (uint256 i = 0; i < _amount; i++) {
            tokenIds.increment();
            _safeMint(_to, tokenIds.current());
            _tokensOfOwner[_msgSender()].add(tokenIds.current());
        }
    }

    /* ************* */
    /* VIEW FUNCTIONS */
    /* ************* */

    /**
     * @notice Get token URI of a NFT
     * @dev Everyone can call
     * @param tokenId Id of NFT
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, tokenId.toString(), baseExtension));
    }

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
