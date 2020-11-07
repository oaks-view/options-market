import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { ERC20TokenService } from '../services/erc20TokenService';

export const useErc20TokenService = (tokenAddress: string) => {
  const { active, account, library } = useWeb3React();

  return React.useMemo(() => {
    if (!active || !library || !account) {
      return null;
    }

    return new ERC20TokenService(library, account, tokenAddress);
  }, [active, library, account]);
};

export default useErc20TokenService;
