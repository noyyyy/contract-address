//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { Common } from './common.sol';

contract CommonFactory {
  event ContractCreated(address);

  function deployCommon() external {
    Common common = new Common();
    emit ContractCreated(address(common));
  }

  function deployCommonByAssembly() external {
    address addr;
    bytes memory bytecode = type(Common).creationCode;

    assembly {
      addr := create(0, add(bytecode, 32), mload(bytecode))
    }
    emit ContractCreated(addr);
  }
}
