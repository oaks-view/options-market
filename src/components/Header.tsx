import React from 'react';
import { Box, Button, AppBar, makeStyles, Theme } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import logo from '../assets/images/logo.svg';

export const injected = new InjectedConnector({
  supportedChainIds: [1], // just MainNet for now
});

export const Header: React.FunctionComponent = () => {
  const {
    activate,
    active,
    error,
    account,
    chainId,
    connector,
  } = useWeb3React();

  return (
    <Box
      zIndex="10000"
      position="fixed"
      bgcolor="#ffffff"
      height="50px"
      width="100%"
      padding="50px 80px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <img src={logo} />

      <Box>{error?.message}</Box>
      <Button
        onClick={() => activate(injected)}
        startIcon={
          <FiberManualRecordIcon color={active ? 'primary' : 'secondary'} />
        }
        variant="outlined"
        size="medium"
      >
        {active &&
          `${account?.substr(0, 7)}...${account?.substr(
            account?.length - 8,
            account?.length
          )}`}
        {!active && 'Connect Wallet'}
      </Button>
    </Box>
  );
};
