import {
  createMuiTheme,
  Theme,
  responsiveFontSizes,
} from '@material-ui/core/styles';

const defaultTheme: Theme = createMuiTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

const PRIMARY_COLOR = '#4FC2A0';

export default responsiveFontSizes(
  createMuiTheme({
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      primary: {
        ...defaultTheme.palette.primary,
        main: PRIMARY_COLOR,
      },
      secondary: {
        ...defaultTheme.palette.secondary,
        main: '#F55536',
        dark: '#E14122',
        light: '#FF6B4C',
      },
    },
    overrides: {
      MuiButton: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          color: '#ffffff',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: PRIMARY_COLOR,
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: PRIMARY_COLOR,
          },
          '&:disabled': {
            backgroundColor: PRIMARY_COLOR,
            opacity: '50%',
          },
        },
        containedSecondary: {
          color: '#ffffff',
          '&:disabled': {
            backgroundColor: '#F55536',
            opacity: '50%',
            color: '#ffffff',
          },
        },
        sizeLarge: {
          fontSize: '1rem',
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
      MuiList: {
        root: {
          minWidth: '160px',
        },
      },
    },
  })
);
