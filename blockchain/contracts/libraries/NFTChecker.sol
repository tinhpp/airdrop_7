// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

library NFTChecker {
    using ERC165Checker for address;
    bytes4 internal constant IID_IERC165 = type(IERC165).interfaceId;
    bytes4 internal constant IID_IERC721 = type(IERC721).interfaceId;
    bytes4 internal constant IID_IERC1155 = type(IERC1155).interfaceId;
    bytes4 internal constant IID_IERC2981 = type(IERC2981).interfaceId;

    function isERC165(address _contractAddr) internal view returns (bool) {
        return _contractAddr.supportsInterface(IID_IERC165);
    }

    function isERC721(address _contractAddr) internal view returns (bool) {
        return _contractAddr.supportsInterface(IID_IERC721);
    }

    function isERC1155(address _contractAddr) internal view returns (bool) {
        return _contractAddr.supportsInterface(IID_IERC1155);
    }

    function isImplementRoyalty(address _contractAddr) internal view returns (bool) {
        return _contractAddr.supportsInterface(IID_IERC2981);
    }
}
