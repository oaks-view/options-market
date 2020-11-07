import {
  withStyles,
  Theme,
  createStyles,
  fade,
  InputBase,
  TextField,
} from '@material-ui/core';

export const TextFieldCustom = withStyles(
  ({ palette: { grey, primary } }: Theme) => ({
    root: {
      '& .MuiInput-underline:after': {
        borderBottomColor: grey[400],
        border: `1px solid ${grey[400]}`,
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: grey[400],
        },
        '&:hover fieldset': {
          borderColor: grey[400],
        },
        '&.Mui-focused fieldset': {
          borderColor: grey[400],
        },
      },
    },
  })
)(TextField);
