import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

import { store, history } from './store';
import { ConnectedRouter } from 'connected-react-router';

import App from './App';

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
