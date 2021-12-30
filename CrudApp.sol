//pragma solidity ^0.5.16;
//pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;
pragma abicoder v2;

contract CrudApp {

    struct Temp{
        int t;
        uint h;
        int hI;
        uint timestamp;
    }
    Temp[] public weatherdb; 

   function setval(Temp memory recTemp) public{
       weatherdb.push(recTemp);
   }

    function getval() public view returns(Temp[] memory)
    {
        return weatherdb;
    }
}