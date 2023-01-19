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

  function deployCommonByCreate2() external {
    bytes32 salt = bytes32(uint256(1));
    Common addr = new Common{ salt: salt }();

    emit ContractCreated(address(addr));
  }

  function deployCommonByCreate2Assembly() external {
    address addr;
    bytes memory bytecode = type(Common).creationCode;
    bytes32 salt = bytes32(uint256(1));

    assembly {
      addr := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
    emit ContractCreated(addr);
  }

  function deployCommonByCreate2Assembly(bytes memory bytecode) external {
    address addr;
    bytes32 salt = bytes32(uint256(1));

    assembly {
      addr := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
    emit ContractCreated(addr);
  }

  function deployContractByCreate2Assembly(bytes memory bytecode, bytes32 salt) external {
    address addr;

    assembly {
      addr := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
  }
}
