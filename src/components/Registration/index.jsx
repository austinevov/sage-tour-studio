import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios';
import { push } from 'connected-react-router';

import { default as GenericSageLogo } from '../SageLogo';
import { Button, Input, Span } from '../../styles';
import Login from './Login';
import { validateEmail } from '../../utils/validateEmail';
import { isArray } from 'util';

class Registration extends Component {
  state = {
    isShowingLogin: true,
    firstName: { value: '', badFlag: false },
    lastName: { value: '', badFlag: false },
    password: { value: '', badFlag: false },
    email: { value: '', badFlag: false },
    errors: []
  };

  toggleLogin = () => {
    this.setState({ isShowingLogin: !this.state.isShowingLogin });
  };

  handleInput = evt => {
    const name = evt.target.name;
    this.setState({
      [name]: Object.assign(this.state[name], {
        value: evt.target.value,
        badFlag: false
      })
    });
  };

  handleSubmit = () => {
    const errors = [];
    let invalid = false;
    if (this.state.firstName.value.length <= 0) {
      invalid = true;
      errors.push('First name cannot be empty!');

      this.setState({
        firstName: Object.assign(this.state.firstName, { badFlag: true })
      });
    }

    if (this.state.lastName.value.length <= 0) {
      invalid = true;

      errors.push('Last name cannot be empty!');

      this.setState({
        lastName: Object.assign(this.state.lastName, { badFlag: true })
      });
    }

    if (this.state.email.value.length <= 0) {
      invalid = true;

      errors.push('Email cannot be empty!');

      this.setState({
        email: Object.assign(this.state.email, { badFlag: true })
      });
    } else if (!validateEmail(this.state.email.value)) {
      invalid = true;

      this.setState({
        email: Object.assign(this.state.email, { badFlag: true })
      });
      errors.push('Email cannot be invalid!');
    }

    if (this.state.password.value.length <= 0) {
      invalid = true;

      errors.push('Password cannot be empty!');

      this.setState({
        password: Object.assign(this.state.password, { badFlag: true })
      });
    } else if (this.state.password.value.length < 8) {
      invalid = true;

      errors.push('Password must be at least 8 characters long!');
      this.setState({
        password: Object.assign(this.state.password, { badFlag: true })
      });
    }

    this.setState({ errors });

    if (!invalid) {
      const email = this.state.email.value;
      const password = this.state.password.value;
      axios
        .post('/register', {
          email,
          password,
          firstName: this.state.firstName.value,
          lastName: this.state.lastName.value
        })
        .then(response => {
          this.props.dispatch(push('/'));
        })
        .catch(err => {
          const { errors } = err.response.data;
          if (errors) {
            this.setState({ errors: [].concat(errors) });
          } else {
            this.setState({ errors: 'Unknown server failure' });
          }
        });
    }
  };

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="sweep"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        {this.state.isShowingLogin && (
          <Login key="login" toggleLogin={this.toggleLogin} />
        )}
        {!this.state.isShowingLogin && (
          <Grid key="registration">
            <Header>
              <SageLogo style={{ visibility: 'hidden' }} />
              <LoginButton onClick={this.toggleLogin}>Login</LoginButton>
            </Header>
            <RegistrationContainer>
              <RegistrationForm onSubmit={evt => evt.preventDefault()}>
                <h1>Sign up for your free Sage account</h1>
                <h3>Start creating, discovering, and sharing tours today!</h3>
                <InputGrid>
                  <RegistrationInput
                    gr="1/2"
                    gc="1/2"
                    name="firstName"
                    onChange={this.handleInput}
                    value={this.state.firstName.value}
                    bad={this.state.firstName.badFlag}
                    placeholder="First name"
                  />
                  <RegistrationInput
                    gr="1/2"
                    gc="2/3"
                    name="lastName"
                    onChange={this.handleInput}
                    value={this.state.lastName.value}
                    bad={this.state.lastName.badFlag}
                    placeholder="Last name"
                  />
                  <RegistrationInput
                    gr="2/3"
                    gc="1/2"
                    name="email"
                    onChange={this.handleInput}
                    value={this.state.email.value}
                    bad={this.state.email.badFlag}
                    placeholder="Your email"
                  />
                  <RegistrationInput
                    gr="2/3"
                    gc="2/3"
                    name="password"
                    onChange={this.handleInput}
                    value={this.state.password.value}
                    bad={this.state.password.badFlag}
                    placeholder="Set a password"
                    type="password"
                  />
                </InputGrid>
                {this.state.errors.length > 0 && (
                  <ErrorSpan>{this.state.errors[0]}</ErrorSpan>
                )}
                <CreateAccountButton onClick={this.handleSubmit}>
                  Create Account
                </CreateAccountButton>
              </RegistrationForm>
            </RegistrationContainer>
          </Grid>
        )}
      </ReactCSSTransitionGroup>
    );
  }
}

const ErrorSpan = styled(Span)`
  color: rgba(255, 64, 64, 0.7);
`;

const RegistrationInput = styled(Input)`
  ${props =>
    css`
      grid-row: ${props.gr};
      grid-column: ${props.gc};
    `};

  ${props =>
    props.bad &&
    css`
      background-color: rgba(255, 0, 0, 0.3);
    `};
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  grid-gap: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const CreateAccountButton = styled(Button)`
  width: 100%;
  border-radius: 4px;
  background-color: #3b4056;
  color: white;
  margin-top: 10px;
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
  position: static;
`;

const LoginButton = styled(Button)`
  background-color: transparent;
  color: #3b4056;
  border: 1px solid #3b4056;
  border-radius: 16px;
  padding: 8px 10px;
  font-size: 1.1rem;
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
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 10vh 90vh;

  position: absolute;
  left: 0px;

  &.sweep-enter {
    left: -100vw;
    &.sweep-enter-active {
      left: 0px;
      transition: left 500ms ease-in-out;
    }
  }

  &.sweep-leave {
    position: absolute;
    left: 0px;
    &.sweep-leave-active {
      left: -100vw;
      transition: left 500ms ease-in-out;
    }
  }
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
