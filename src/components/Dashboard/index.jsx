import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import ShaderBackground from '../ShaderBackground';
import dynamicVertex from '../../shaders/dyn-gradient-vs.glsl';
import dynamicFragment from '../../shaders/dyn-gradient-fs.glsl';
import { default as GenericSageLogo } from '../SageLogo';
import { default as GenericLogoutButton } from '../LogoutButton';
import { Button } from '../../styles';
import { VOID_CONTENT, ACCOUNT_CONTENT } from '../../constants/contentTypes';
import Account from '../Account';
import { CHANGE_CONTENT } from '../../constants/actionTypes';

class Dashboard extends Component {
  render() {
    return (
      <ShaderBackground
        vertexSource={dynamicVertex}
        fragmentSource={dynamicFragment}>
        <TransparentBackground>
          <Header>
            <SageLogo />
            <LinkNav>
              <Route to="/about">About</Route>
              <Route to="/features">Features</Route>
              <Route to="/gallery">Gallery</Route>
              <Route
                onClick={() => {
                  this.props.changeContent(ACCOUNT_CONTENT);
                }}>
                My Account
              </Route>
              <LogoutButton />
            </LinkNav>
          </Header>
          <ContentBody>
            {this.props.activeContent === ACCOUNT_CONTENT && <Account />}
          </ContentBody>
        </TransparentBackground>
      </ShaderBackground>
    );
  }
}

const ContentBody = styled.div`
  flex-grow: 1;
`;

const SageLogo = styled(GenericSageLogo)`
  position: static;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const LogoutButton = styled(GenericLogoutButton)`
  border-radius: 2px;
  font-size: 1rem;
  height: 41px;
  width: 130px;

  border: 2px solid #4d575a;
  background-color: #4d575a;

  margin-left: 10px;
`;

const LinkNav = styled.nav`
  position: relative;
  top: -40px;
  margin-right: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Route = styled(Button)`
  color: #ffffff;
  font-family: Spectral;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 21px;
  text-decoration: none;
  margin-left: 10px;
  margin-right: 10px;
  background-color: transparent;
`;

const TransparentBackground = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(54, 64, 76, 0.7);
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  &,
  * {
    z-index: 2;
  }
`;

function mapStateToProps(state) {
  return {
    activeContent: state.dashboard.activeContent
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeContent: content => {
      dispatch({ type: CHANGE_CONTENT, payload: { content } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
