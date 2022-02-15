// SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.6;

import "../libraries/LibLockDOC.sol";

contract LockDOCStorage {
    /// @dev flag for pause proxy
    bool public pauseProxy;

    uint256 public epochUnit;
    uint256 public maxTime;

    uint256 public constant MULTIPLIER = 1e18;

    address public doc;
    uint256 public lockIdCounter;
    uint256 public cumulativeEpochUnit;
    uint256 public cumulativeDOCAmount;

    uint256 internal free = 1;

    address[] public uniqueUsers;
    LibLockDOC.Point[] public pointHistory;
    mapping(uint256 => LibLockDOC.Point[]) public lockPointHistory;
    mapping(address => mapping(uint256 => LibLockDOC.LockedBalance))
        public lockedBalances;

    mapping(uint256 => LibLockDOC.LockedBalance) public allLocks;
    mapping(address => uint256[]) public userLocks;
    mapping(uint256 => int256) public slopeChanges;
    mapping(uint256 => bool) public inUse;
}
