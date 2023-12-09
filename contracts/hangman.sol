// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.8.20;

import "fhevm/lib/TFHE.sol";

contract Hangman { 
    euint8[] private encryptedCharsInv;
    bytes private decryptedWord;

    bool private luckyGuess;
    bool private playerWon;
    uint8 private lives;
    uint8 private nOfCellsRevealed;

    uint8 private constant MAX_LETTERS = 4;
    uint8 private constant QUESTIONMARK = 63;

    constructor () {
        lives = 5;
    }

    function setWord(bytes memory inSecret) public {
        euint32 fourBytes = TFHE.asEuint32(inSecret);
        decryptedWord = new bytes(MAX_LETTERS);

        for (uint8 i = 0; i < MAX_LETTERS; i++){
            encryptedCharsInv.push(TFHE.asEuint8(TFHE.shr(fourBytes, i*8)));
            decryptedWord[i] = bytes1(uint8(QUESTIONMARK));
        }
    }

    function guessLetter(string memory letter) public {
        require(lives > 0);

        bool foundAtLeastOne = false;
        bytes memory asBytes = bytes(letter);
        for (uint8 i = 0; i < encryptedCharsInv.length; i++) {
            ebool possibleMatch = TFHE.eq(encryptedCharsInv[i] , uint8(asBytes[0]));
            if (TFHE.decrypt(possibleMatch) == true) {
                uint8 decryptedLetter = TFHE.decrypt(encryptedCharsInv[i]);
                decryptedWord[decryptedWord.length-1 - i] = bytes1(decryptedLetter);
                foundAtLeastOne = true;
                nOfCellsRevealed = nOfCellsRevealed + 1;
            }
        }

        if (foundAtLeastOne) {
            lives = lives - 1;
            if (nOfCellsRevealed >= encryptedCharsInv.length) {
                setPlayerAsWinner();
            }
        }
    }

    function setPlayerAsWinner() internal {
        playerWon = true;
    }

    function guessEntireWord(string memory word) public {
        require(lives > 0);
        require(bytes(word).length == encryptedCharsInv.length);

        bytes memory asBytes = bytes(word);
        for (uint8 i = 0; i < encryptedCharsInv.length; i++) {
            ebool possibleMatch = TFHE.eq(encryptedCharsInv[i] , uint8(asBytes[bytes(word).length-1 - i]));
            if (TFHE.decrypt(possibleMatch) == false) {
                //Guessed incorrectly, game over
                lives = 0;
            } else {
                //Guessed correctly
                luckyGuess = true;
                setPlayerAsWinner();
            }
        }
    }

    function showWord() public view returns (string memory) {
        return string(decryptedWord);
    }

    function hasWon() public view returns (bool) {
        return playerWon;
    }
}