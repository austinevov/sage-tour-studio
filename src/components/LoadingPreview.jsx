import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import Loader from 'react-loader-spinner';

class LoadingPreview extends Component {
  render() {
    return (
      <Wrapper
        color={this.props.color}
        backgroundImage={this.props.backgroundImage}>
        <LoadingSpan size="24px">{this.props.name}</LoadingSpan>
        <LoadingSpan size="12px" mb="1rem">
          {`Presented by ${this.props.organization}`}
        </LoadingSpan>
        <Loader
          type="Circles"
          color={this.props.color}
          height="25"
          width="25"
        />
        <LoadingSpan size="10px">37%</LoadingSpan>
        <CaptionWrapper>
          <LoadingSpan size="9px" noupper>
            {this.props.caption}
          </LoadingSpan>
        </CaptionWrapper>
        {this.props.children}
      </Wrapper>
    );
  }
}

const CaptionWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  > span {
    font-family: serif;
  }
`;
const LoadingSpan = styled.span`
  color: white;
  font-family: 'Cinzel', serif;
  ${props =>
    css`
      font-size: ${props.size};
    `}
  ${props =>
    css`
      margin-bottom: ${props.mb};
    `}
`;

const Wrapper = styled.div`
  position: relative;
  flex-grow: 1;
  border: 2px dashed #e1e2e4;
  ${props => css`background-image: url('${props.backgroundImage}')`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    ${props =>
      css`
        color: ${props.color};
      `}
  }
`;

export default LoadingPreview;
