import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Span, Button } from '../../styles';

import { default as GenericCreateTourButton } from './CreateTourButton';
import TourTable from './TourTable';
import CreateTour from '../CreateTour';
import { SET_CREATE_TOUR } from '../../constants/actionTypes';
import Confirmation from '../Confirmation';

class Account extends Component {
  createTour = () => {
    this.props.setCreateTour(true);
  };

  cancelCreateTour = () => {
    this.props.setCreateTour(false);
  };

  render() {
    return (
      <Container>
        {!this.props.isCreatingTour ? (
          <AccountContainer>
            <CreateTourButton onClick={this.createTour} />
            <ProfileOverview>
              <PublicDetails>
                <ProfilePicture src='/man.svg' />
                <IRLDetails>
                  <Span color='#4D575A' fontSize='32px' lineHeight='50px'>
                    {this.props.firstName} {this.props.lastName}
                  </Span>
                  <Span color='#4D575A' fontSize='18px' lineHeight='27px'>
                    Organization,
                    <Span
                      color='#4D575A'
                      fontSize='18px'
                      lineHeight='27px'
                      italics
                    >
                      {' Role'}
                    </Span>
                  </Span>
                </IRLDetails>
              </PublicDetails>
              <FlexBuffer />
              <LoginDetails>
                <Span
                  gr='1/2'
                  gc='1/2'
                  color='#4D575A'
                  fontSize='18px'
                  lineHeight='27px'
                >
                  Email
                </Span>
                <Span
                  gr='1/2'
                  gc='2/3'
                  color='#4D575A'
                  fontSize='18px'
                  lineHeight='27px'
                  italics
                >
                  {this.props.email}
                </Span>
                <Span
                  gr='2/3'
                  gc='1/2'
                  color='#4D575A'
                  fontSize='18px'
                  lineHeight='27px'
                >
                  Phone
                </Span>
                <Span
                  gr='2/3'
                  gc='2/3'
                  color='#4D575A'
                  fontSize='18px'
                  lineHeight='27px'
                  italics
                />
                <Span
                  fontSize='10px'
                  gr='3/4'
                  gc='3/4'
                  color='#4D575A'
                  fontSize='10px'
                  lineHeight='16px'
                  italics
                  underline
                >
                  Change Password
                </Span>
              </LoginDetails>
            </ProfileOverview>
            <TourTable />
          </AccountContainer>
        ) : (
          <CreateTour cancelCreateTour={this.cancelCreateTour} />
        )}
        {this.props.isShowingConfirmation && <Confirmation />}
      </Container>
    );
  }
}

const CreateTourButton = styled(GenericCreateTourButton)`
  position: absolute;
  top: 25px;
  right: 25px;
`;

const FlexBuffer = styled.div`
  flex-grow: 1;
`;
const PublicDetails = styled.div`
  display: flex;
  flex-direction: flex-start;
  align-items: flex-start;
  flex-grow: 2;
`;
const LoginDetails = styled.div`
  display: grid;
  grid-template-columns: 135px 215px;
  grid-template-rows: repeat(3, 1fr);
  flex-grow: 3;
  grid-gap: 10px 0px;
`;

const IRLDetails = styled.div`
  height: 125px;
  display: flex;
  flex-direction: column;
  grid-template-columns: repeat(2, 200px) repeat(4, 60px) repeat(2, 20px);
  justify-content: center;
  align-items: flex-start;
`;

const ProfilePicture = styled.img`
  border-radius: 50%;
  width: 125px;
  height: 125px;
  margin-right: 25px;
`;

const ProfileOverview = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const AccountContainer = styled.div`
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 70px 140px;

  overflow-y: auto;

  width: 1000px;
  height: 450px;
`;

function mapStateToProps(state) {
  return {
    isCreatingTour: state.dashboard.isCreatingTour,
    email: state.user.email,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    isShowingConfirmation: state.dashboard.isShowingConfirmation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCreateTour: flag => {
      dispatch({ type: SET_CREATE_TOUR, payload: { flag } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
