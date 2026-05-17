// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Compiled by Hardhat from contracts/. Keep in sync with /cfxcrowd.sol at repo root.

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

    function contribute() public payable {
        require(block.timestamp < deadline, "Campaign ended");
        require(msg.value > 0, "Send some CFX");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    function withdraw() public {
        require(msg.sender == creator, "Not creator");
        require(block.timestamp >= deadline, "Campaign not ended");
        require(totalRaised >= goal, "Goal not reached");

        payable(creator).transfer(address(this).balance);
    }

    function refund() public {
        require(block.timestamp >= deadline, "Campaign not ended");
        require(totalRaised < goal, "Goal was reached");

        uint amount = contributions[msg.sender];
        require(amount > 0, "No contribution");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
