import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import '@ant-design/pro-card/dist/card.css';
import './App.less';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from '../hooks/use-store';
import ApolloProvider from '../providers/ApolloProvider';
import Main from './Main';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <ApolloProvider>
      <StoreProvider>
        <Router>
          <Main>
            <React.Suspense fallback={null}>
              <AppRoutes />
            </React.Suspense>
          </Main>
        </Router>
      </StoreProvider>
    </ApolloProvider>
  );
}

export default App;