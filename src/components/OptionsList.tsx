import React from 'react';
import {
  Box,
  CircularProgress,
  Select,
  MenuItem,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';

import { OrderTicket } from './OrderTicket';
import { ETH_ASSETS } from '../constants';
import { getETHAssetPriceInUSD } from '../helpers/token';
import { Option } from '../models';
import { getUnixTimestamp } from '../helpers/utils';
import { OptionsTable } from './OptionsTable';
import { SelectedOptionProvider } from './SelectedOptionProvider';

const getOptionsQuery = (
  protectedAssetAddress: string,
  expirationUnixTime: number
) => gql`
  {
    optionsContracts(
      where: { underlying: "${protectedAssetAddress}", expiry_gte: "${expirationUnixTime}"  }
    ) {
      address
      oTokenExchangeRateValue
      oTokenExchangeRateExp
      underlying
      strike
      strikePriceValue
      expiry
    }
  }
`;

interface ProtectedAsset {
  priceInUSD: number;
  symbol: string;
  address: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    assetSelect: {
      marginTop: theme.spacing(2),
      width: '100px',
      height: '40px',
      marginRight: '20px',
    },
    expirationSelect: {
      width: '400px',
      height: '40px',
    },
  })
);

const protectedAssetDefault: ProtectedAsset = {
  priceInUSD: 0,
  symbol: ETH_ASSETS.uni.symbol,
  address: ETH_ASSETS.uni.address,
};

const OptionsList: React.FunctionComponent = () => {
  const classes = useStyles();

  const [protectedAsset, setProtectedAsset] = React.useState<ProtectedAsset>(
    protectedAssetDefault
  );
  const [usdcPrice, setUsdcPrice] = React.useState<number>(0);
  const [expirationDateIndex, setExpirationDateIndex] = React.useState(0);

  const { loading, error, data, client } = useQuery(
    getOptionsQuery(protectedAsset.address, getUnixTimestamp())
  );

  React.useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    const [usdcPrice, protectedAssetPrice] = await Promise.all([
      getETHAssetPriceInUSD(ETH_ASSETS.usdc.address),
      getETHAssetPriceInUSD(
        ETH_ASSETS[protectedAsset.symbol.toLowerCase()].address
      ),
    ]);

    setUsdcPrice(usdcPrice);
    setProtectedAsset({
      ...protectedAsset,
      priceInUSD: protectedAssetPrice,
    });
  };

  const handleExpirationSelectChange = (event) => {
    event.preventDefault();

    setExpirationDateIndex(+event.target.value);
  };

  return (
    <SelectedOptionProvider>
      <Box
        paddingTop="100px"
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        paddingX="2%"
      >
        <Box width="100%" marginBottom="30px">
          <Box display="flex" fontSize="24px" fontWeight="500">
            <Box marginRight="8px">{protectedAsset.symbol.toUpperCase()}</Box>
            <Box color="grey.400">
              {protectedAsset?.priceInUSD || <CircularProgress size="23" />}
            </Box>
          </Box>
          <Box>
            <Select
              value={10}
              defaultValue={protectedAsset.symbol.toUpperCase()}
              variant="outlined"
              className={classes.assetSelect}
              fullWidth
            >
              <MenuItem value={10}>
                {protectedAsset.symbol.toUpperCase()}
              </MenuItem>
            </Select>
            <Select
              value={expirationDateIndex}
              defaultValue={protectedAsset.symbol.toUpperCase()}
              variant="outlined"
              className={classes.expirationSelect}
              fullWidth
              onChange={handleExpirationSelectChange}
            >
              {!!data &&
                data.optionsContracts.map((dto: Option, index: number) => {
                  const option = new Option().fromDto(dto);
                  return (
                    <MenuItem value={index} key={index}>
                      <Box
                        display="flex"
                        width="100%"
                        height="100%"
                        fontSize="16px"
                        fontWeight={500}
                      >
                        <Box marginRight="5px">
                          Expiring {option.expirationDate.toDateString()}
                        </Box>
                        <Box color="grey.400">8:00 PM</Box>
                      </Box>
                    </MenuItem>
                  );
                })}
            </Select>
          </Box>
        </Box>
        <Box display="flex" width="100%">
          <Box
            width="70%"
            display="flex"
            justifyContent="center"
            alignItems={loading ? 'center' : 'flex-start'}
          >
            {loading && <CircularProgress />}
            {/* {!loading && JSON.stringify(data, undefined, 2)} */}
            {!loading && (
              <OptionsTable
                options={data?.optionsContracts.map((dto) =>
                  new Option().fromDto(dto)
                )}
              />
            )}
          </Box>
          <Box
            width="30%"
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            <OrderTicket
              // todo remove this
              option={{
                expiry: new Date(),
                isPut: true,
                price: 9.24,
                strikePrice: 240,
                underlying: {
                  address: '0x4262426538e63d5c3637262aecbcd7eacfce630',
                  symbol: 'USDC',
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </SelectedOptionProvider>
  );
};

export { OptionsList };
