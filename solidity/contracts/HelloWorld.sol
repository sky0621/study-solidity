// comment
pragma solidity ^0.8.18;

contract HelloWorld {
    function getMessage() external pure returns (string memory) {
        return "Hello world";
    }
}