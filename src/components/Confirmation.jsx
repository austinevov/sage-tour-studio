import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { DEACTIVATE_CONFIRMATION } from '../constants/actionTypes';

const Confirmation = props => {
  return (
    <Container onClick={() => props.deactivateConfirmation()}>
      <ConfirmationContainer onClick={evt => evt.stopPropagation()}>
        <p>
          Are you sure? <br />
          <span>This action cannot be undone!</span>
        </p>
        <ButtonContainer>
          <ConfirmButton onClick={() => props.confirmation(props.payload)}>
            Confirm
          </ConfirmButton>
          <CancelButton onClick={() => props.deactivateConfirmation()}>
            Cancel
          </CancelButton>
        </ButtonContainer>
      </ConfirmationContainer>
    </Container>
  );
};
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const Button = styled.button`
  border: none;
  outline: none;
  padding: 7px 15px;
  text-align: center;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: bold;

  cursor: pointer;

  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  transition: opacity 200ms ease-in-out;
`;

const ConfirmButton = styled(Button)`
  background-color: #db3b34;
  margin-right: 5em;
  color: white;
`;
const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #4d575a;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9;
`;
const ConfirmationContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -179px;
  margin-left: -222.5px;
  width: 445px;
  height: 258px;
  box-sizing: border-box;

  padding: 12.5px 50px;
  z-index: 10;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  color: #4d575a;
  background-color: whitesmoke;
  border: 1px solid #4d575a;

  font-family: 'Spectral';
  box-shadow: 5px 5px 2px 0px rgba(0, 0, 0, 0.75);

  p {
    font-size: 1.6em;
    font-weight: 500;
    text-align: left;
    span {
      text-align: center;
      font-weight: bold;
    }
  }
`;

function mapStateToProps(state) {
  return {
    payload: state.dashboard.confirmationPayload
  };
}

function mapDispatchToProps(dispatch) {
  return {
    confirmation: data => {
      const { type, ...payload } = data;
      console.log(data);
      dispatch({ type, payload });
    },
    deactivateConfirmation: () => {
      dispatch({ type: DEACTIVATE_CONFIRMATION });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirmation);
