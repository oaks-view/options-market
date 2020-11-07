import React from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

import { useSelectedOption } from './SelectedOptionProvider';
import { Option } from '../models/index';

interface SelectOptionsBtnProps {
  option: Option;
}

const btnDark = 'rgba(51,51,51,1)';

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
    border: `solid ${btnDark} 1px`,
    height: '28px',
    display: 'flex',
    borderRadius: '4px',
    color: ({ isSelected }: any) => (!isSelected ? btnDark : '#ffffff'),
    background: ({ isSelected }: any) => (isSelected ? btnDark : '#ffffff'),
    '&:hover': {
      background: btnDark,
      color: '#ffffff',
    },
  },
  textContainer: {
    width: '70%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: 500,
    borderRight: ({ isSelected }: any) =>
      !isSelected ? `1px solid ${btnDark}` : '1px solid #ffffff',
    '&:hover': {
      borderRight: '1px solid #ffffff',
    },
  },
});

const SelectOptionsBtn: React.FunctionComponent<SelectOptionsBtnProps> = ({
  children,
  option,
}) => {
  const { selectedOption, setSelectedOption } = useSelectedOption();

  const isSelected =
    !!selectedOption && selectedOption.address === option.address;
  const classes = useStyles({ isSelected });

  const handleOnclick = () => {
    if (isSelected) return setSelectedOption(null);
    setSelectedOption(option);
  };

  return (
    <Box className={classes.root} onClick={handleOnclick}>
      <Box className={classes.textContainer}>{children}</Box>
      <Box
        display="flex"
        width="30%"
        justifyContent="center"
        alignItems="center"
      >
        {!isSelected && <AddIcon fontSize="small" />}
        {isSelected && <CheckIcon fontSize="small" />}
      </Box>
    </Box>
  );
};

export { SelectOptionsBtn };
