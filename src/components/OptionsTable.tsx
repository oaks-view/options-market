import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import ArrowDropUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { SelectOptionsBtn } from './SelectOptionsBtn';
import { Option } from '../models';

const TableContainer: React.FunctionComponent = ({ children }) => (
  <Box border="solid #E0E0E0 1px" width="100%">
    {children}
  </Box>
);

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
  };
}

interface RowProps {
  option: Option;
}

function Row(props: RowProps) {
  const { option } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const [optionPrice, setOptionPrice] = React.useState<number>(0);

  React.useEffect(() => {
    getOptionPrice();
  });

  const getOptionPrice = () => {
    // todo call smart contract to get premium
    setOptionPrice(12);
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          Unknown row
        </TableCell>
        <TableCell align="center">NA</TableCell>
        <TableCell align="center">{option.strikePriceValue || 'NA'}</TableCell>
        {/* break even */}
        <TableCell align="center">NA</TableCell>
        <TableCell align="center">
          <SelectOptionsBtn option={option}>
            {optionPrice === 0 ? 'fetching...' : optionPrice}
          </SelectOptionsBtn>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface OptionsTableProps {
  options: Option[];
}

export const OptionsTable: React.FunctionComponent<OptionsTableProps> = ({
  options = [],
}) => {
  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              <Box
                fontSize="20px"
                fontWeight="500"
                display="flex"
                justifyContent="center"
              >
                CALLS <ArrowDropDownIcon />
              </Box>
            </TableCell>
            <TableCell colSpan={3} align="center">
              <Box
                fontSize="20px"
                fontWeight="500"
                display="flex"
                justifyContent="center"
              >
                PUTS <ArrowDropDownIcon />
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell>Implied Volatility</TableCell>
            <TableCell align="center">Volume</TableCell>
            <TableCell align="center">Strike</TableCell>
            <TableCell align="center">Breakeven</TableCell>
            <TableCell align="center">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {options.map((option, index) => (
            <Row key={index} option={option} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
