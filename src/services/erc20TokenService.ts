import { Contract, ethers, Wallet } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

const erc20TokenAbi = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address marketMaker) external view returns (uint256)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function supplyRatePerBlock() external view returns (uint)',
  'function exchangeRateCurrent() returns (uint)',
  'function exchangeRateStored() public view returns (uint)',
];

class ERC20TokenService {
  contract: Contract;

  constructor(
    private provider: Web3Provider,
    private signerAddress: string,
    private tokenAddress: string
  ) {
    this.contract = new ethers.Contract(tokenAddress, erc20TokenAbi, provider);
  }

  async decimals() {
    return this.contract.decimals();
  }

  async getBalance(): Promise<BigNumber> {
    return this.contract.balanceOf(this.signerAddress);
  }
}

export { ERC20TokenService };
