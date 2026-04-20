// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleCrowdfund {

    address public creator;
    uint public goal;
    uint public deadline;
    uint public totalRaised;

    mapping(address => uint) public contributions;

    constructor(uint _goalInCFX, uint _durationInMinutes) {
        creator = msg.sender;
        goal = _goalInCFX * 1e18;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    // Contribute funds
    function contribute() public payable {
        require(block.timestamp < deadline, "Campaign ended");
        require(msg.value > 0, "Send some CFX");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    // Withdraw if goal reached
    function withdraw() public {
        require(msg.sender == creator, "Not creator");
        require(block.timestamp >= deadline, "Campaign not ended");
        require(totalRaised >= goal, "Goal not reached");

        payable(creator).transfer(address(this).balance);
    }

    // Refund if goal not reached
    function refund() public {
        require(block.timestamp >= deadline, "Campaign not ended");
        require(totalRaised < goal, "Goal was reached");

        uint amount = contributions[msg.sender];
        require(amount > 0, "No contribution");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}