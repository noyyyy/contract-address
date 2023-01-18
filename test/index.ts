import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, Wallet } from 'ethers';
import { arrayify, getAddress, hexDataSlice, keccak256, parseEther, RLP, stripZeros } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

describe('General deploy', function () {
  let _: SignerWithAddress;
  let eoa: Wallet;
  this.beforeAll(async () => {
    [_] = await ethers.getSigners();
    // a random account
    eoa = new ethers.Wallet(ethers.utils.randomBytes(32), _.provider);
    // send some gas to random account
    _.sendTransaction({ to: eoa.address, value: parseEther('10') });
  });

  it('Should address deployed by EOA calculate successfully', async function () {
    // get nonce as uint8array
    const nonce = stripZeros(arrayify(BigNumber.from(await eoa.getTransactionCount()).toHexString()));
    /// sha3(rlp.encode(address,nonce))
    /// then get last 20 bytes and format in checkSum
    const computedAddress = getAddress(hexDataSlice(keccak256(RLP.encode([eoa.address, nonce])), 12));

    // deploy the contract
    const commonFactory = await ethers.getContractFactory('Common');
    const common = await commonFactory.connect(eoa).deploy();

    expect(common.address).to.be.equal(computedAddress);
  });
  it('Should address deployed by contract calculate successfully', async function () {
    // deploy the Factory contract
    const commonFactory = await ethers.getContractFactory('CommonFactory');
    const commonF = await commonFactory.connect(eoa).deploy();

    // get nonce as uint8array
    const nonce = stripZeros(arrayify(BigNumber.from(1).toHexString()));

    /// sha3(rlp.encode(address,nonce))
    /// then get last 20 bytes and format in checkSum
    const computedAddress = getAddress(hexDataSlice(keccak256(RLP.encode([commonF.address, nonce])), 12));

    const deployTx = await commonF.deployCommon();
    const rc = await deployTx.wait();

    const deployedEvent = rc.events?.find((event) => event.event === 'ContractCreated');

    const addr = deployedEvent?.args?.[0];

    expect(addr).to.be.equal(computedAddress);
  });
  it('Should address deployed by contract assembly calculate successfully', async function () {
    // deploy the Factory contract
    const commonFactory = await ethers.getContractFactory('CommonFactory');
    const commonF = await commonFactory.connect(eoa).deploy();

    // get nonce as uint8array
    const nonce = stripZeros(arrayify(BigNumber.from(1).toHexString()));

    /// sha3(rlp.encode(address,nonce))
    /// then get last 20 bytes and format in checkSum
    const computedAddress = getAddress(hexDataSlice(keccak256(RLP.encode([commonF.address, nonce])), 12));

    const deployTx = await commonF.deployCommonByAssembly();
    const rc = await deployTx.wait();

    const deployedEvent = rc.events?.find((event) => event.event === 'ContractCreated');

    const addr = deployedEvent?.args?.[0];

    expect(addr).to.be.equal(computedAddress);
  });
});
