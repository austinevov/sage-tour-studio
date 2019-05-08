import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { Button } from '../styles';
import { LOGOUT } from '../constants/actionTypes';

const LogoutButton = props => (
  <Logout {...props} onClick={props.logout}>
    Logout
  </Logout>
);

const Logout = styled(Button)`
  background-color: transparent;
  border: 1px solid white;

  border-radius: 16px;
  color: white;
  padding: 5px 15px;
  font-size: 0.9rem;
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch({ type: LOGOUT });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutButton);
