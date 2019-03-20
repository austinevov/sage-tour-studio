import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import * as sc from '../../styles';

const CreateTourButton = props => (
  <Button onClick={props.onClick} className={props.className}>
    + create a tour
  </Button>
);

const Button = styled(sc.Button)`
  color: #ffffff;
  font-family: Spectral;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  text-transform: uppercase;
  letter-spacing: 1.66px;

  height: 41px;
  width: 205px;
  border: 2px solid #4d575a;
  background-color: #4d575a;
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTourButton);
