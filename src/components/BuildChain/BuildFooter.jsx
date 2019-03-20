import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import * as sc from '../../styles';

const BuildFooter = props => (
  <Wrapper>
    <StatusBarWrapper>
      <StatusBar>
        <StatusSpan color="#dddddd" fontSize="0.8rem">
          {props.stageMeta.depth}) {props.stageMeta.footerDetail}
        </StatusSpan>
      </StatusBar>
      <StatusTriangle />
    </StatusBarWrapper>
    {props.children}
  </Wrapper>
);

const Wrapper = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  height: 8vh;
  width: 100vw;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;

  background-color: rgb(76, 82, 104, 1);
  box-shadow: 0px -15px 28px -27px rgba(0, 0, 0, 0.75);
  z-index: 100;
`;

const FooterButton = styled(sc.Button)`
  padding-left: 75px;
  padding-right: 75px;

  font-size: 1rem;

  text-transform: uppercase;
`;

const GreenButton = styled(FooterButton)`
  background-color: #1ed390;
  color: white;
  cursor: pointer;
  ${props =>
    props.disabled &&
    css`
      background-color: #d0d4d7;
      cursor: default;
    `}
`;

const YellowButton = styled(FooterButton)`
  background-color: #f0c330;
  color: #fffefe;
  cursor: pointer;
  ${props =>
    props.disabled &&
    css`
      background-color: #d0d4d7;
      cursor: default;
    `}
`;

export const NextButton = props => (
  <GreenButton {...props}>Next &#8250;</GreenButton>
);

export const UploadButton = props => (
  <YellowButton {...props}>Upload ⭳</YellowButton>
);

const StatusBarWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

const StatusBar = styled.div`
  padding: 0px 40px;

  background-color: #3b4056;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StatusSpan = styled(sc.Span)`
  text-transform: uppercase;
  font-weight: bold;
`;

const StatusTriangle = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4vh 0 4vh 30px;
  border-color: transparent transparent transparent #3b4056;
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    nextDetail: () => {
      dispatch({ type: NEXT_DETAIL });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildFooter);
