pragma solidity ^0.4.22;

contract EosValidator {
    function isValidKey(string str) public pure returns (bool){
        bytes memory b = bytes(str);
        if(b.length != 53) return false;

        // EOS
        if (bytes1(b[0]) != 0x45 || bytes1(b[1]) != 0x4F || bytes1(b[2]) != 0x53)
            return false;

        for(uint i = 3; i<b.length; i++){
            bytes1 char = b[i];

            // base58
            if(!(char >= 0x31 && char <= 0x39) &&
               !(char >= 0x41 && char <= 0x48) &&
               !(char >= 0x4A && char <= 0x4E) &&
               !(char >= 0x50 && char <= 0x5A) &&
               !(char >= 0x61 && char <= 0x6B) &&
               !(char >= 0x6D && char <= 0x7A)) 
            return false;
        }

        return true;
    }

    function isValidAccount(string account) public pure returns (bool){
        bytes memory b = bytes(account);
        if (b.length != 12) return false;

        for(uint i = 0; i<b.length; i++){
            bytes1 char = b[i];

            // a-z && 1-5 && .
            if(!(char >= 0x61 && char <= 0x7A) && 
               !(char >= 0x31 && char <= 0x35) && 
               !(char == 0x2E)) 
            return  false;
        }
        
        return true;
    }
}