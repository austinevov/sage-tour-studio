import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import * as sc from '../../styles';
import BatchUploader from './BatchUploader';
import {
  UPDATE_TOUR_DESCRIPTION,
  UPDATE_TOUR_BUILDING_NAME,
  UPDATE_TOUR_NAME,
  UPLOAD_TOUR
} from '../../constants/actionTypes';
import Loader from 'react-loader-spinner';
class CreateTour extends Component {
  upload = () => {
    if (this.props.name.length <= 0) {
      alert('Tour name cannot be empty');
      return;
    }

    if (this.props.buildingName.length <= 0) {
      alert('Building name cannot be empty');
      return;
    }

    if (this.props.floorplans.length <= 0) {
      alert('At least one floorplan must be uploaded');
      return;
    }

    if (this.props.panoramas.length <= 0) {
      alert('At least one panorama must be uploaded');
      return;
    }

    this.props.upload();
  };

  render() {
    return (
      <Container>
        <BackButton
          onClick={this.props.cancelCreateTour}
          disabled={this.props.isUploading}>
          <img src="/backArrow.svg" />
        </BackButton>
        <Span>Create Tour</Span>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <TourProperties>
          <TourInput
            gr="1/2"
            gc="1/2"
            placeholder="Tour Name"
            value={this.props.name}
            onChange={evt => this.props.updateName(evt.target.value)}
          />
          <TourInput
            gr="1/2"
            gc="2/3"
            placeholder="Building/Project Name"
            value={this.props.buildingName}
            onChange={evt => this.props.updateBuildingName(evt.target.value)}
          />
          <TourInputArea
            gr="2/4"
            gc="1/3"
            placeholder="Tour Description"
            value={this.props.description}
            onChange={evt => this.props.updateDescription(evt.target.value)}
          />
        </TourProperties>
        <UploaderContainer>
          <BatchUploader name="floorplan" disabled={this.props.isUploading} />
          <BatchUploader name="panorama" disabled={this.props.isUploading} />
        </UploaderContainer>
        <ContinueButton onClick={this.upload} disabled={this.props.isUploading}>
          Continue Creating Tour 🡪
        </ContinueButton>
        {this.props.isUploading && (
          <TransparentBackground>
            <LoadingSpan>Uploading...</LoadingSpan>
            <Loader
              type="ThreeDots"
              color="white"
              width="100px"
              height="100px"
            />
          </TransparentBackground>
        )}
      </Container>
    );
  }
}
const LoadingSpan = styled(sc.Span)`
  z-index: 150001;
  color: white;
  font-size: 4rem;
`;
const TransparentBackground = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 150000;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ContinueButton = styled(sc.Button)`
  height: 41px;
  width: 332px;
  border: 2px solid #4d575a;
  background-color: #4d575a;

  color: #ffffff;
  font-family: Spectral;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2.33px;
  line-height: 21px;

  text-transform: uppercase;
`;
const BackButton = styled.button`
  position: absolute;
  top: 26px;
  left: 26px;
  margin: 0;
  padding: 0;
  cursor: pointer;
  border: none;
  outline: none;
  background-color: transparent;
  img {
    width: 20px;
    height: 20px;
  }
`;
const TourProperties = styled.div`
  display: grid;
  grid-template-columns: 330px 330px;
  grid-template-rows: 50px 50px 50px;
  grid-gap: 23px 37px;
`;
const SharedInput = css`
  background-color: transparent;
  border: 0;
  outline: none;
  height: 24px;
  width: 83px;
  color: #4d575a;
  font-family: Spectral;
  font-size: 16px;
  line-height: 24px;
  border: 2px solid #4d575a;
  box-sizing: border-box;

  width: 100%;
  height: 100%;
  padding-left: 10px;
  padding-right: 10px;

  &::placeholder {
    opacity: 0.8;
  }
`;
const TourInput = styled.input`
  ${SharedInput}
  ${props =>
    css`
      grid-row: ${props.gr};
      grid-column: ${props.gc};
    `};
`;
const TourInputArea = styled.textarea`
  ${SharedInput}
  resize: none;
  padding-top: 10px;
  ${props =>
    css`
      grid-row: ${props.gr};
      grid-column: ${props.gc};
    `};
`;
const UploaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;
const Span = styled(sc.Span)`
  color: #4d575a;
  font-family: Spectral;
  font-size: 32px;
  line-height: 49px;
  text-align: center;
`;
const Container = styled.div`
  position: relative;
  background-color: white;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding: 70px 140px;

  width: 1000px;
  height: 600px;

  p {
    margin: 0;
    margin-top: 10px;
    margin-bottom: 20px;
    padding: 0;
    width: 55%;
    color: #4d575a;
    font-family: Spectral;
    font-size: 18px;
    line-height: 27px;
    text-align: center;
  }
`;
function mapStateToProps(state) {
  return {
    name: state.tour.name,
    buildingName: state.tour.buildingName,
    description: state.tour.description,
    isUploading: state.tour.isUploading,
    floorplans: state.tour.floorplans.allIds,
    panoramas: state.tour.panoramas.allIds
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateName: name => {
      dispatch({ type: UPDATE_TOUR_NAME, payload: { name } });
    },
    updateBuildingName: name => {
      dispatch({ type: UPDATE_TOUR_BUILDING_NAME, payload: { name } });
    },
    updateDescription: description => {
      dispatch({ type: UPDATE_TOUR_DESCRIPTION, payload: { description } });
    },
    upload: () => {
      dispatch({ type: UPLOAD_TOUR });
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTour);
