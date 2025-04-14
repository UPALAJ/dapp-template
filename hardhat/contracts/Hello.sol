// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Hello {

    string someText = "hello world";
    
    function print() external view returns (string memory) {
        return someText;
    }

    function write(string memory _input) external {
        someText = _input;
    }
}