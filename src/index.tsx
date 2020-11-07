import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';
import { ToastProvider } from 'react-toast-notifications';

import './styles/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

// function getLibrary(provider, connector) {
function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
}

const client = new ApolloClient({
  // uri: 'https://48p1r2roz4.sse.codesandbox.io',
  uri: 'https://api.thegraph.com/subgraphs/name/aparnakr/opyn',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <ToastProvider placement="top-center">
          <App />
        </ToastProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
