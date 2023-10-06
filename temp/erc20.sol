// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./ierc20.sol";

contract ERC20 is IERC20 {
    uint private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    address private _owner;
    // {
    //   "0x1a2b3c4d5e...1": "100000",
    //   "0x1a2b3c4d5e...2": "200000",
    // }
    mapping(address => uint) private _balances;
    // {
    //   // owner = amount の所有者
    //   "0x6p7q8r9s0t...1": {
    //     // spender = owner から許可を受けて amount を消費する人
    //     "0x1a2b3c4d5e...1": "1000",
    //     "0x1a2b3c4d5e...2": "2000",
    //   }
    // }
    mapping(address => mapping(address => uint)) private _allowances;

    constructor (string memory name_, string memory symbol_, uint8 decimals_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        _owner = msg.sender;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function totalSupply() external view returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint) {
        return _balances[account];
    }

    function allowance(address owner, address spender) external view returns (uint) {
        return _allowances[owner][spender];
    }

    function mint(address account, uint amount) external {
        require(msg.sender == _owner, "only contract owner can call mint");
        require(account != address(0), "mint to the zero address is not allowed");
        _totalSupply = _totalSupply + amount;
        _balances[account] = _balances[account] + amount;
        emit Transfer(address(0), account, amount);
    }

    function burn(address account, uint amount) external {
        require(msg.sender == _owner, "only contract owner can call burn");
        require(account != address(0), "burn to the zero address is not allowed");
        _totalSupply = _totalSupply - amount;
        _balances[account] = _balances[account] - amount;
        emit Transfer(account, address(0), amount);
    }

    function transfer(address recipient, uint amount) external returns (bool) {
        require(recipient != address(0), "transfer to the zero address is not allowed");
        address sender = msg.sender;
        require(_balances[sender] >= amount, "transfer amount cannot exceed balance");
        _balances[sender] = _balances[sender] - amount;
        _balances[recipient] = _balances[recipient] + amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        require(spender != address(0), "approve to the zero address is not allowed");
        address owner = msg.sender;
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint amount) external returns (bool) {
        require(recipient != address(0), "transfer to the zero address is not allowed");
        require(_balances[sender] >= amount, "transfer amount cannot exceed balance");
        _balances[sender] = _balances[sender] - amount;
        _balances[recipient] = _balances[recipient] + amount;
        emit Transfer(sender, recipient, amount);

        address spender = msg.sender;
        require(_allowances[sender][spender] >= amount, "insufficient allowance");
        _allowances[sender][spender] = _allowances[sender][spender] - amount;
        emit Approval(sender, spender, _allowances[sender][spender]);

        return true;
    }

}
