import Web3 from 'web3';
import TokenBalance from '@myetherwallet/eth-token-balance';
import { BigNumber, utils } from 'ethers';
import { ETH_ASSETS } from '../constants';

// todo move this to environmental variables
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://mainnet.infura.io/v3/a07a72994ea94c3fa0b2ed9b620db9d7'
  )
);

const tokenBalance = new TokenBalance(web3.currentProvider);

const getAddressTokenBalances = async (address: string) => {
  return tokenBalance.getBalance(address);
};

// added this because od inability to get balance probably same issue in the foln URL
// https://ethereum.stackexchange.com/questions/70515/usd-coin-balance-check-by-web3
const getTokenBalance = async (
  address: string,
  symbol: string = 'USDC'
): Promise<BigNumber> => {
  const tokenBalances = await getAddressTokenBalances(address);

  const token = tokenBalances.find((x) => x.symbol === symbol);
  return BigNumber.from(!token ? 0 : token.balance);
};

// todo rename to something more generic

const formatTokenValue = (value: BigNumber, symbol = 'USDC'): string => {
  const tokenArray = Object.values(ETH_ASSETS);
  const token = tokenArray.find(
    (x) => x.symbol.toLocaleLowerCase() === symbol.toLocaleLowerCase()
  );

  return !token ? '0' : utils.formatUnits(value.toString(), token?.decimals);
};

// fetches the price of eth and tokens in dollars. Defaults to Ethers
// const getETHAssePriceInUSD = async (tokenAddress?: string): Promise<string> => {
const getETHAssetPriceInUSD = async (
  tokenAddress?: string
): Promise<number> => {
  let url = !tokenAddress
    ? 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    : `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`;

  const resultJSON = await fetch(url);
  const result = await resultJSON.json();
  return !tokenAddress
    ? result['ethereum'].usd
    : result[tokenAddress.toLowerCase()].usd;
};

const getSymbolFromTokenAddress = (tokenAddress: string) => {
  const tokenArray = Object.values(ETH_ASSETS);

  return tokenArray.find(
    (x) => x.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase()
  ).symbol;
};

export {
  getAddressTokenBalances,
  getTokenBalance,
  formatTokenValue,
  getETHAssetPriceInUSD,
  getSymbolFromTokenAddress,
};
