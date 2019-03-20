import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { default as GenericSageLogo } from '../SageLogo';
import { Button, Input, Span } from '../../styles';
import axios from 'axios';
import {
  FETCH_AUTHENTICATE,
  AUTHENTICATE,
  RECEIVE_SELF,
  LOGOUT
} from '../../constants/actionTypes';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: []
  };

  handleInput = evt => {
    const { name } = evt.target;

    this.setState({ [name]: evt.target.value });
  };

  handleSubmit = () => {
    const { email, password } = this.state;

    axios
      .post('/login', { email, password })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          this.props.authenticate();
          axios
            .get('/getSelf', { withCredentials: true })
            .then(response => {
              this.props.receiveSelf(response.data);
            })
            .catch(err => {
              this.props.logout();
            });
          this.props.dispatch(push('/'));
        }
      })
      .catch(err => {
        const errors = [];
        if (!err.response) {
          errors.push('Server not responding');
        } else {
          errors.push('Invalid username or password');
        }

        this.setState({ errors });
      });
  };

  render() {
    return (
      <Grid {...this.props}>
        <Header>
          <SageLogo />
          <RegistrationButton onClick={this.props.toggleLogin}>
            Sign up
          </RegistrationButton>
        </Header>
        <RegistrationContainer>
          <RegistrationForm onSubmit={evt => evt.preventDefault()}>
            <h1>Login to your Sage Account</h1>
            <RegistrationInput
              placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={this.handleInput}
            />
            <RegistrationInput
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.handleInput}
              type="password"
            />
            {this.state.errors.length > 0 && (
              <ErrorSpan>{this.state.errors[0]}</ErrorSpan>
            )}
            <LoginButton onClick={this.handleSubmit}>Login</LoginButton>
          </RegistrationForm>
        </RegistrationContainer>
      </Grid>
    );
  }
}

const ErrorSpan = styled(Span)`
  color: rgba(255, 64, 64, 0.7);
`;

const RegistrationInput = styled(Input)`
  width: 100%;
  margin: 10px 0px;
`;

const LoginButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
  border-radius: 4px;
  background-color: #292c3c;
  box-sizing: content-box;
  color: white;
`;

const RegistrationForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: auto;

  h1,
  h3 {
    font-weight: 300;
    margin: 5px 0px;
    color: white;
  }

  h3 {
    opacity: 0.5;
  }
`;

const RegistrationContainer = styled.div`
  grid-row: 2/3;
  grid-column: 1/2;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 50px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const SageLogo = styled(GenericSageLogo)`
  position: relative;
  top: 25px;
  color: white;
`;

const RegistrationButton = styled(Button)`
  background-color: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 16px;
  padding: 8px 10px;
  font-size: 1.1rem;
  opacity: 0.85;
`;

const Header = styled.div`
  grid-row: 1/2;
  grid-column: 1/2;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 50px;
`;

const Grid = styled.div`
  position: absolute;
  background-color: #3b4056;
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 10vh 90vh;
  right: 0px;

  &.sweep-enter {
    right: -100vw;
    &.sweep-enter-active {
      right: 0px;
      transition: right 500ms ease-in-out;
    }
  }

  &.sweep-leave {
    position: absolute;
    right: 0px;
    &.sweep-leave-active {
      right: -100vw;
      transition: right 500ms ease-in-out;
    }
  }
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    authenticate: () => {
      dispatch({ type: AUTHENTICATE });
    },
    receiveSelf: self => {
      dispatch({ type: RECEIVE_SELF, payload: { ...self } });
    },
    logout: () => {
      dispatch({ type: LOGOUT });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
