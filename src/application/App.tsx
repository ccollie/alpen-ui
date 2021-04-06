import React from 'react';
import './App.less';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from '../hooks/use-store';
import { DSProvider } from '@synerise/ds-core';
import ApolloProvider from '../providers/ApolloProvider';
import Main from './Main';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <ApolloProvider>
      <StoreProvider>
        <Router>
          <DSProvider>
            <Main>
              <React.Suspense fallback={null}>
                <AppRoutes />
              </React.Suspense>
            </Main>
          </DSProvider>
        </Router>
      </StoreProvider>
    </ApolloProvider>
  );
}

export default App;
