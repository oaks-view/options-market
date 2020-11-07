import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import { OrderTicket } from './OrderTicket';
import { Header } from './Header';
import { OptionsList } from './OptionsList';
import theme from '../styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <OptionsList />
    </ThemeProvider>
  );
}

export default App;
