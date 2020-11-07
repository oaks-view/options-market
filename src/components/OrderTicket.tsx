import React from 'react';
import { Box, makeStyles, Theme, ButtonGroup, Button } from '@material-ui/core';
import clsx from 'clsx';
import { useWeb3React } from '@web3-react/core';
import Big from 'big.js';
import { BigNumber } from 'ethers';

import { TextFieldCustom as TextField } from './TextFieldCustom';
import { computeMaxLossAndGain } from '../helpers/options';
import { formatThousands } from '../helpers/utils';
import { ERC20TokenService } from '../services/erc20TokenService';
import { OptionsService } from '../services/optionsService';
import { useOptionsService } from '../hooks/useOptionsService';
import { useErc20TokenService } from '../hooks/useErc20TokenService';
import {
  formatTokenValue,
  getSymbolFromTokenAddress,
  getTokenBalance,
} from '../helpers/token';
import { useSelectedOption } from './SelectedOptionProvider';
import { ETH_ASSETS } from '../constants';
import { useToaster } from '../hooks/useToaster';

interface IERC20Asset {
  address: string;
  symbol: string;
}

// todo create a class and remove this
interface Option {
  price: number;
  expiry: Date;
  underlying: IERC20Asset;
  strikePrice: number;
  isPut: boolean;
}

interface OrderTicketProps {
  option?: Option;
}

const useStyles = makeStyles(({ palette }: Theme) => ({
  root: {
    width: '340px',
    border: `1px solid ${palette.grey[300]}`,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: '4px',
    minHeight: '500px',
  },
  invite: {
    color: palette.grey[400],
    fontSize: '24px',
    fontWeight: 500,
  },
  header: {
    width: '100%',
    fontSize: '16px',
    fontWeight: 500,
    boxSizing: 'border-box',
  },
  section: {
    padding: '18px',
    width: '100%',
    borderBottom: `1px solid ${palette.grey[300]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  position: {
    height: '28px',
  },
  textInput: {
    height: '0px',
    '&::placeholder': {
      color: palette.grey[400],
    },
  },
}));

interface InfoRowProps {
  label: string;
  value: string;
  valueSub?: string;
}

const useInfoRowStyles = makeStyles({
  root: {
    display: 'flex',
    fontSize: '12px',
    justifyContent: 'space-between',
    marginBottom: '12px',
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

const InfoRow: React.FunctionComponent<InfoRowProps> = ({
  label,
  value,
  valueSub,
  ...rest
}) => {
  const classes = useInfoRowStyles({});

  return (
    <Box className={classes.root}>
      <Box fontWeight="500" color="grey.400">
        {label}
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Box>{value}</Box>
        {!!valueSub && (
          <Box display="inline" color="grey.400" marginLeft="4px">
            {valueSub}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const OrderTicket: React.FunctionComponent<OrderTicketProps> = ({
  option,
}) => {
  const classes = useStyles({});
  const toaster = useToaster();

  const { active, account = '', library, error } = useWeb3React();
  const { selectedOption } = useSelectedOption();

  const optionsService = useOptionsService(
    selectedOption && selectedOption.address
  );

  const [positionSize, setPositionSize] = React.useState<number>(0);
  const [isBuyPosition, setIsBuyPosition] = React.useState<boolean>(false);

  const [walletBalance, setWalletBalance] = React.useState<BigNumber>(
    BigNumber.from(0)
  );

  const [usdctoOptionsRate, setUsdcToOptionsRate] = React.useState<BigNumber>(
    BigNumber.from(0)
  );

  React.useEffect(() => {
    initializeValues();
    if (active) {
    }
  }, [active]);

  const initializeValues = async () => {
    try {
      if (!active || !account || !library) return;
      const bal = await getTokenBalance(account!);
      setWalletBalance(bal);

      const usdcToTokenRate = await optionsService?.getUsdcToOptionsRate();

      setUsdcToOptionsRate(usdcToTokenRate!);
    } catch (err) {
      toaster.error(`Erroor occured => %s', ${err.message}`);
    }
  };

  const assetToDollarEqv = (asset: string, value: number) => {
    // todo implement
    return value;
  };

  const valueWithUnit = (
    value: string | number,
    unit: string,
    isPrefix = true
  ): string => (isPrefix ? `${unit}${value}` : `${value} ${unit}`);

  const maxLossAndGain = () => {
    const { price, strikePrice } = option as Option;

    const { maxGain, maxLoss } = computeMaxLossAndGain({
      isBuyPosition,
      positionSize,
      price: option?.price as number,
      strikePrice: option?.strikePrice as number,
    });

    const maxLoss$ = assetToDollarEqv(
      option?.underlying.symbol as string,
      maxLoss
    );
    const maxGain$ = assetToDollarEqv(
      option?.underlying.symbol as string,
      maxGain
    );

    const assetSymbol = option?.underlying.symbol.toUpperCase() as string;

    const collateralRequirement = strikePrice * positionSize;

    const collateralRequirement$ = formatThousands(
      assetToDollarEqv(option?.underlying.symbol as string, maxGain)
    );

    const cost = price * positionSize;
    const cost$ = assetToDollarEqv(option?.underlying.symbol as string, cost);

    return {
      maxLoss: valueWithUnit(formatThousands(maxLoss), assetSymbol, false),
      maxLoss$: valueWithUnit(formatThousands(maxLoss$), '$'),
      maxGain: valueWithUnit(formatThousands(maxGain), assetSymbol, false),
      maxGain$: valueWithUnit(formatThousands(maxGain$), '$'),
      collateralRequirement: `${collateralRequirement} ${assetSymbol}`,
      collateralRequirement$: valueWithUnit(collateralRequirement$, '$'),
      cost: valueWithUnit(formatThousands(cost), assetSymbol, false),
      cost$: valueWithUnit(formatThousands(cost$), '$'),
      //  todo compute price impact
      priceImpact: '11%',
    };
  };

  const {
    maxGain,
    maxGain$,
    maxLoss,
    maxLoss$,
    collateralRequirement,
    collateralRequirement$,
    cost,
    cost$,
    priceImpact,
  } = maxLossAndGain();

  const handleOnClick = async (event: any) => {
    try {
      event.preventDefault();

      if (!account || !account)
        return toaster.error('Please connect or install metamask');

      toaster.info(account);
    } catch (err) {
      toaster.error(error.message);
    }
  };

  const getCostOfSellPosition = (): string => {
    if (usdctoOptionsRate.isZero()) return '0';
    const costPerUnit = new Big(usdctoOptionsRate.toString()).div(1e18);

    const value = costPerUnit.times(positionSize);

    return value.toString();
  };

  const handleOnChange = (event) => {
    const value = +event.target.value;

    setPositionSize(value);
  };

  return (
    <Box
      className={classes.root}
      justifyContent={!selectedOption ? 'center' : 'flex-start'}
    >
      {!selectedOption && <Box className={classes.invite}>+ Select Option</Box>}
      {!!selectedOption && (
        <>
          <Box
            className={clsx(classes.section, classes.header)}
          >{`${getSymbolFromTokenAddress(selectedOption.underlying)}  $${
            selectedOption.strikePriceValue
          } ${option.isPut ? 'Put' : 'Call'}`}</Box>
          <Box className={clsx(classes.section)} width="100%">
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gridColumnGap="10px"
              width="100%"
              marginBottom="8px"
            >
              <Box>
                <Box marginBottom="4px" color="grey.400">
                  Position Size
                </Box>
                <TextField
                  value={positionSize}
                  onChange={handleOnChange}
                  type="number"
                  placeholder="0"
                  variant="outlined"
                  InputProps={{
                    classes: { input: classes.textInput },
                    endAdornment: (
                      <Box paddingLeft="5px" color="grey.400">
                        options
                      </Box>
                    ),
                  }}
                />
              </Box>
              <Box display="flex" alignItems="flex-end">
                <ButtonGroup disableElevation variant="contained" fullWidth>
                  <Button
                    color={isBuyPosition ? 'primary' : 'default'}
                    onClick={() => setIsBuyPosition(true)}
                  >
                    Buy
                  </Button>
                  <Button
                    color={!isBuyPosition ? 'secondary' : 'default'}
                    onClick={() => setIsBuyPosition(false)}
                  >
                    Sell
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
            <Box>
              {([
                {
                  label: 'Max Loss',
                  value: maxLoss,
                  valueSub: maxLoss$,
                },
                {
                  label: 'Max Gain',
                  value: maxGain,
                  valueSub: maxGain$,
                },
              ] as Array<InfoRowProps>).map(
                ({ label, value, valueSub }, index) => (
                  <InfoRow
                    label={label}
                    value={value}
                    valueSub={valueSub}
                    key={index}
                  />
                )
              )}
            </Box>
          </Box>

          <Box className={classes.section} width="100%">
            {([
              {
                label: isBuyPosition ? 'Cost' : 'Earning',
                value: cost,
                valueSub: cost$,
              },
              ...(isBuyPosition
                ? []
                : [
                    {
                      label: 'Collateral Requirement',
                      value: valueWithUnit(
                        getCostOfSellPosition(),
                        ETH_ASSETS.usdc.symbol,
                        false
                      ),
                    },
                  ]),
              {
                label: 'Wallet Balance',
                value: valueWithUnit(
                  formatTokenValue(walletBalance),
                  ETH_ASSETS.usdc.symbol,
                  false
                ),
              },
              ...(isBuyPosition
                ? []
                : [
                    {
                      label: 'Collateral Requirement',
                      value: collateralRequirement,
                      valueSub: collateralRequirement$,
                    },
                  ]),
              {
                label: 'Price Impact',
                value: priceImpact,
              },
            ] as Array<InfoRowProps>).map(
              ({ label, value, valueSub }, index) => (
                <InfoRow
                  label={label}
                  value={value}
                  valueSub={valueSub}
                  key={index}
                />
              )
            )}
          </Box>
          <Box
            className={classes.section}
            width="100%"
            textAlign="center"
            paddingX="10%"
            fontSize="12px"
            color="grey.400"
          >
            If you want you can create a spread, select another option.{' '}
            <Box color="primary.main" display="inline">
              Learn More
            </Box>
          </Box>
          <Box className={classes.section}>
            <Button
              onClick={handleOnClick}
              disableElevation
              variant="contained"
              color="secondary"
              fullWidth
              disabled={!positionSize || positionSize < 1}
            >
              Unlock USDC
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

// export type { Order };
