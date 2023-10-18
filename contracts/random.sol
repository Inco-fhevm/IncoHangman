// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

import "fhevm/lib/TFHE.sol";

contract IncoSlots {
    event RandomNumber(uint16 number);

    function spin() public returns (uint16) {
        euint16 enumber = TFHE.randEuint16();
        uint16 rnd = TFHE.decrypt(enumber);
        emit RandomNumber(rnd);
        return rnd;
    }
}