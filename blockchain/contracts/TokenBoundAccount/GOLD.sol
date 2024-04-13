// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GOLD is ERC20 {
    event Minted(address account, uint256 amount);

    /* *********** */
    /* CONSTRUCTOR */
    /* *********** */
    constructor() ERC20("GOLD", "GOLD") {}

    /* ****************** */
    /* EXTERNAL FUNCTIONS */
    /* ****************** */

    /**
     * @notice Mint GOLD to user
     * @dev Everyone can call this function
     */
    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);

        emit Minted(_to, _amount);
    }
}
