pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/** @title BlackHole 
 * 
 * @dev Implementation of the BlackHole contract.
 * It deadlocks ERC20 tockens and emit events on success.
 */
contract BlackHole {
    event Opened();
    event Teleport(uint amount, string note);
    event Closed();

    bool public closed = false;
    ERC20 public erc20Contract;
    uint public minimumAmount;
    uint public startTime;
    uint public eligibleCloseTime;

    /** @dev Construction of the ETH BlackHole contract.
     * @param _erc20Contract The address of the ERC20 contract to attract tockens from.
     * @param _minDurationDays BlackHole can be closed after set days.
     * @param _minimumAmount the smallest amount BlackHole can attract.
     */
    constructor(address _erc20Contract, uint _minDurationDays, uint _minimumAmount) public {
        erc20Contract = ERC20(_erc20Contract);
        minimumAmount = _minimumAmount;
        startTime = block.timestamp; //start when contract is issued.
        // Approximate. Does not account for leap seconds.
        eligibleCloseTime = startTime + (_minDurationDays * 86400);
        emit Opened();
    }

    /** @dev It closes the BlackHole if critical block has been reached.
     */
    function close() public {
        require(!closed, "This BlackHole contract's active period has expired.");
        require(block.timestamp >= eligibleCloseTime, "BlackHole hasn't reached the critical mass");
        closed = true;
        emit Closed();
    }

    /** @dev teleport attracts tokens and emit Teleport event
     * @param note Teleport event note.
     */
    function teleport(string note) public {
        uint amount = attract();
        emit Teleport(amount, note);
    }

    function attract() private returns (uint amount){
        require(!closed, "blackHole closed");
        uint balance = erc20Contract.balanceOf(msg.sender);
        uint allowed = erc20Contract.allowance(msg.sender, address(this));
        require(allowed >= minimumAmount, "less than minimum amount");
        require(balance == allowed, "blackHole must attract all your tokens");
        require(erc20Contract.transferFrom(msg.sender, address(this), balance), "blackHole can't attract your tokens");
        return balance;
    }

    // Approximate based on timestamp and 86400 epoch day
    function daysLeft() constant returns (uint) {
      return (eligibleCloseTime - block.timestamp) / 86400;
    }

}
