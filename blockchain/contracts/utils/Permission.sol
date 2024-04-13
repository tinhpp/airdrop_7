// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 *  @title  Permission
 *
 *  @notice This abstract contract provides a modifier to restrict the permission of functions.
 */
abstract contract Permission is Ownable {
    /* ******* */
    /* STORAGE */
    /* ******* */

    /**
     *  @notice _admins mapping from token ID to isAdmin status
     */
    mapping(address => bool) public admins;

    /* ****** */
    /* EVENTS */
    /* ****** */

    event SetAdmin(address indexed user, bool allow);

    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */

    constructor() {}

    /* ********* */
    /* MODIFIERS */
    /* ********* */

    /**
     * Throw exception of caller is not admin
     */
    modifier onlyAdmin() {
        require(owner() == _msgSender() || admins[_msgSender()], "Ownable: caller is not an admin");
        _;
    }

    /**
     * Throw exception if _addr is zero address
     * @param _addr Address will be checked
     */
    modifier notZeroAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    /**
     * Throw exception if _amount if zero
     * @param _amount Nubmer will be checked
     */
    modifier notZeroAmount(uint256 _amount) {
        require(_amount > 0, "Invalid amount");
        _;
    }

    /**
     * Throw exception if _account is not permitted
     * @param _account Account will be checked
     */
    modifier permittedTo(address _account) {
        require(msg.sender == _account, "Permission: Unauthorized.");
        _;
    }

    /* ****************** */
    /* PUBLIC FUNCTIONS */
    /* ****************** */

    /**
     * @notice Add/Remove an admin.
     * @dev    Only owner can call this function.
     * @param _user user address
     * @param _allow Specific user will be set as admin or not
     */
    function setAdmin(address _user, bool _allow) public virtual onlyOwner {
        _setAdmin(_user, _allow);
    }

    /**
     * @notice Add/Remove an admin.
     * @dev    Only owner can call this function.
     * @param _users List of user address
     * @param _allow Specific users will be set as admin or not
     */
    function setAdmins(address[] memory _users, bool _allow) public virtual onlyOwner {
        require(_users.length > 0, "Invalid length");
        for (uint256 i = 0; i < _users.length; i++) {
            _setAdmin(_users[i], _allow);
        }
    }

    /* ****************** */
    /* INTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice Add/Remove an admin.
     * @dev    Only owner can call this function.
     * @param _user User address
     * @param _allow Specific user will be set as admin or not
     * 
     * emit {SetAdmin} event
     */
    function _setAdmin(address _user, bool _allow) internal virtual notZeroAddress(_user) {
        admins[_user] = _allow;
        emit SetAdmin(_user, _allow);
    }

    /* ****************** */
    /* VIEW FUNCTIONS */
    /* ****************** */

    /**
     * @notice Check account whether it is the admin role.
     * @dev Everyone can call
     * @param _account User's account will be checkedd
     */
    function isAdmin(address _account) external view returns (bool) {
        return admins[_account];
    }
}
