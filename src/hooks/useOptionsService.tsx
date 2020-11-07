import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { OptionsService } from '../services/optionsService';

export const useOptionsService = (otokenAddress: string) => {
  const { active, account, library } = useWeb3React();

  return React.useMemo(() => {
    if (!active || !library || !account) {
      return null;
    }

    return new OptionsService(otokenAddress, account, library);
  }, [active, library, account]);
};

export default useOptionsService;
