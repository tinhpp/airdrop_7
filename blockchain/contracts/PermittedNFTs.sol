// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./interfaces/IPermittedNFTs.sol";
import "./utils/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title  PermittedNFTs
 * @dev Registry for the contracts supported by Loan protocol.
 */
contract PermittedNFTs is Ownable, Pausable, ReentrancyGuard, IPermittedNFTs {
    /* ******* */
    /* STORAGE */
    /* ******* */

    /**
     * @notice A mapping from an NFT contract's address to the Token type of that contract. A zero Token Type indicates
     * non-permitted.
     */
    mapping(address => bool) private nftPermits;

    /* ****** */
    /* EVENTS */
    /* ****** */

    /**
     * @notice This event is fired whenever the admin sets a NFT permit.
     *
     * @param nftContract - Address of the NFT contract.
     * @param isPermitted - Signals NFT permit.
     */
    event NFTPermit(address indexed nftContract, bool isPermitted);

    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */

    /**
     * @dev Initializes `contracts`
     *
     * @param _admin - Initial admin of this contract.
     */
    constructor(address _admin) Ownable(_admin) {}

    /* ****************** */
    /* EXTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice Change the permitted list status of an NFT contract. This
     * includes both adding an NFT contract to the permitted list and removing it.
     * `_nftContract` can not be zero address.
     * @dev Only owner can call
     * @param _nftContract - The address of the NFT contract.
     * @param _isPermitted - true - enable / false - disable
     */
    function setNFTPermit(address _nftContract, bool _isPermitted) external onlyOwner {
        _setNFTPermit(_nftContract, _isPermitted);
    }

    /**
     * @notice Change the permitted list status of a batch NFT contracts. This
     * includes both adding an NFT contract to the permitted list and removing it.
     * `_nftContract` can not be zero address.
     * @dev Only owner can call
     * @param _nftContracts - The addresses of the NFT contracts.
     * @param _isPermitted - true - enable / false - disable
     */
    function setNFTPermits(address[] memory _nftContracts, bool _isPermitted) external onlyOwner {
        _setNFTPermits(_nftContracts, _isPermitted);
    }

    /* ************** */
    /* VIEW FUNCTIONS */
    /* ************** */

    /**
     * @notice Lookup the Nft Type associated with the contract.
     * @dev Everyone can call this function
     * @param  _nftContract - The address of the NFT contract.
     */
    function getNFTPermit(address _nftContract) external view override returns (bool) {
        return nftPermits[_nftContract];
    }

    /* ****************** */
    /* INTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice This function changes the permitted list status of an NFT contract. This includes both adding an NFT
     * contract to the permitted list and removing it.
     * @param _nftContract - The address of the NFT contract.
     * @param _isPermitted - true - enable / false - disable
     */
    function _setNFTPermit(address _nftContract, bool _isPermitted) internal {
        require(_nftContract != address(0), "nftContract is zero address");
        nftPermits[_nftContract] = _isPermitted;
        emit NFTPermit(_nftContract, _isPermitted);
    }

    /**
     * @notice This function changes the permitted list status of a batch NFT contracts. This includes both adding an
     * NFT contract to the permitted list and removing it.
     * @param _nftContracts - The addresses of the NFT contracts.
     * @param _isPermitted - true - enable / false - disable
     */
    function _setNFTPermits(address[] memory _nftContracts, bool _isPermitted) internal {
        require(_nftContracts.length > 0, "Invalid length nftContracts");
        for (uint256 i = 0; i < _nftContracts.length; i++) {
            _setNFTPermit(_nftContracts[i], _isPermitted);
        }
    }
}
