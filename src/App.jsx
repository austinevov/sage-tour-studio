import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import axios from 'axios';

import BuildChain from './components/BuildChain';
import TourDesigner from './components/TourDesigner';
import Registration from './components/Registration';
import { AUTHENTICATE, LOGOUT, RECEIVE_SELF } from './constants/actionTypes';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Account from './components/Account';
import Tour from './components/Tour';

class App extends Component {
  componentDidMount() {
    this.props.authenticate();

    axios
      .get('/getSelf', { withCredentials: true })
      .then(response => {
        this.props.receiveSelf(response.data);
      })
      .catch(err => {
        this.props.logout();
      });
  }

  render() {
    return [
      <GlobalStyle key={0} />,
      <>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <Route path="/login" component={Registration} />
          <PrivateRoute path="/t/:id" component={TourDesigner} />
          <Route path="/v/:id" component={Tour} />
        </Switch>
      </>
    ];
  }
}

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Cinzel|Poiret+One|Varela+Round');
@import url('https://fonts.googleapis.com/css?family=Spectral');
* {
  font-family: 'Spectral', serif;

}
html, body {
  margin: 0;
  padding: 0;
  background: #f7f8fc;
  background-size: cover;
}
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    authenticate: () => {
      dispatch({ type: AUTHENTICATE });
    },
    logout: () => {
      dispatch({ type: LOGOUT });
    },
    receiveSelf: self => {
      dispatch({ type: RECEIVE_SELF, payload: { ...self } });
    }
  };
}

export default withCookies(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(App)
  )
);
