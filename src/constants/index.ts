interface AppToken {
  symbol: string;
  address: string;
  decimals: number;
  name?: string;
}

const ETH_ASSETS = {
  usdc: {
    symbol: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    name: 'USD Coin (USDC)',
  },
  uni: {
    symbol: 'UNI',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18,
    name: 'Uniswap (UNI)',
  },
  weth: {
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    name: 'Wrapped Ether (WETH)',
  },
};

export { ETH_ASSETS };
