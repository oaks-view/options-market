import { Contract, ethers, Wallet, BigNumber } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

import { formatTokenValue } from '../helpers/token';

const uniswapFactoryContractAddress =
  '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95';

const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const factoryContractABI = [
  'function createOptionsContract(string memory _collateralType, int32 _collateralExp, string memory _underlyingType, int32 _underlyingExp, int32 _oTokenExchangeExp, uint256 _strikePrice, int32 _strikeExp, string memory _strikeAsset, uint256 _expiry, uint256 _windowSize) public returns (address)',
  'function getNumberOfOptionsContracts() external view returns (uint256)',
];

const factoryContractAddress = '0x34Da8b34c82988e7FF8F98CA35963057fC0ec9bb';

const wethABI = [
  'function deposit() public payable',
  'function withdraw(uint wad) public',
];

const uniswapFactoryABI = [
  'function getExchange(address token) external view returns (address exchange)',
];

const oTokenABI = [
  'function getVault(address payable vaultOwner) external view returns ( uint256, uint256, uint256, bool)',
  'function hasVault(address payable owner) public view returns (bool)',
  'function hasExpired() public view returns (bool)',
  'function addAndSellERC20CollateralOption(uint256 amtToCreate, uint256 amtCollateral, address receiver) external',
  'function createAndSellERC20CollateralOption(uint256 amtToCreate, uint256 amtCollateral, address receiver) external',
  'function addAndSellETHCollateralOption(uint256 amtToCreate, address receiver) public payable',
  'function createAndSellETHCollateralOption(uint256 amtToCreate, address receiver) external payable',
  'function maxOTokensIssuable(uint256 collateralAmt) external view returns (uint256)',
];

const optionExchangeABI = [
  'function premiumToPay(address oTokenAddress, address paymentTokenAddress, uint256 oTokensToBuy) public view returns (uint256)',
  'function premiumReceived(address oTokenAddress, address payoutTokenAddress, uint256 oTokensToSell) public view returns (uint256)',
  'function buyOTokens(address receiver, address oTokenAddress, address paymentTokenAddress, uint256 oTokensToBuy) public payable',
  'function sellOTokens(address receiver, address oTokenAddress, address payoutTokenAddress, uint256 oTokensToSell) public',
];

const oracleContractAddress = '0x7054e08461e3eCb7718B63540adDB3c3A1746415';
const oracleContractABI = [
  'function getPrice(address asset) public view returns (uint256)',
];

class OptionsService {
  // https://github.com/ethers-io/ethers.js/issues/253
  // https://github.com/ethers-io/ethers.js/issues/161
  // added readonly contract instance because of the above error encountered
  private optionsContractReadOnly: Contract;
  private uniswapFactoryContractReadOnly: Contract;
  private optionsContract: Contract;
  private optionsExchangeContract!: Contract;
  private uniswapFactoryContract: Contract;
  private oracleContract: Contract;

  constructor(
    private otokenAddress: string,
    private account: string,
    private provider: Web3Provider
  ) {
    const providerDefault = ethers.getDefaultProvider(provider.network);
    this.optionsContractReadOnly = new ethers.Contract(
      otokenAddress,
      oTokenABI,
      providerDefault
    );

    this.uniswapFactoryContractReadOnly = new ethers.Contract(
      uniswapFactoryContractAddress,
      uniswapFactoryABI,
      providerDefault
    );

    this.oracleContract = new ethers.Contract(
      oracleContractAddress,
      oracleContractABI,
      providerDefault
    );

    const signer = provider.getSigner();

    this.optionsContract = new ethers.Contract(
      otokenAddress,
      oTokenABI,
      provider
    ).connect(signer);

    // todo perhaps delete this one / replace setup as read only
    this.uniswapFactoryContract = new ethers.Contract(
      uniswapFactoryContractAddress,
      uniswapFactoryABI,
      provider
    ).connect(signer);
  }

  async initExchangeContract() {
    if (!this.optionsExchangeContract) {
      const optionsExchangeAddress: string = await this.uniswapFactoryContractReadOnly.getExchange(
        this.otokenAddress
      );

      this.optionsExchangeContract = new ethers.Contract(
        optionsExchangeAddress,
        optionExchangeABI,
        this.provider.getSigner()
      );
    }
  }

  getUSDCPriceInWei = (): Promise<BigNumber> => {
    return this.oracleContract.getPrice(usdcAddress);
  };

  async getUsdcToOptionsRate(): Promise<BigNumber> {
    // 1 usdc in wei
    const usdcWei = await this.getUSDCPriceInWei();

    // get max number options(otokens) that can be issued for 1 usdc
    return this.optionsContract.maxOTokensIssuable(usdcWei);
  }

  async sellOptions(amount: number, amtCollateral: number) {
    const hasVault = await this.optionsContractReadOnly.hasVault(this.account);

    const sellOptionsFunction = hasVault
      ? this.optionsContract.addAndSellERC20CollateralOption
      : this.optionsContract.createAndSellERC20CollateralOption;

    const result = await sellOptionsFunction(
      amount,
      amtCollateral,
      this.account
    );

    return result;
  }

  async buyOTokens(amount: number) {
    if (!this.optionsExchangeContract) await this.initExchangeContract();

    return this.optionsExchangeContract.buyOTokens(
      this.account,
      this.otokenAddress,
      '0x0000000000000000000',
      amount
    );
  }
}

export { OptionsService };
