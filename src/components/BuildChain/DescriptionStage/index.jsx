import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import * as sc from '../../../styles';
import BuildFooter, { NextButton } from '../BuildFooter';
import DragNDropImageUpload from '../../DragNDropImageUpload';
import LoadingPreview from '../../LoadingPreview';
import {
  UPDATE_TOUR_NAME,
  UPDATE_TOUR_CAPTION,
  UPDATE_TOUR_ORGANIZATION,
  UPDATE_TOUR_COVER,
  GOTO_NEXT_STAGE
} from '../../../constants/actionTypes';

class DescriptionStage extends Component {
  receiveUpload = files => {
    const file = files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      this.props.updateCover(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  resetUpload = () => {
    this.props.resetCover();
  };

  render() {
    return (
      <>
        <Grid>
          <UploadWrapper>
            <Label>Upload a tour cover image</Label>
            <Upload
              receiveUpload={this.receiveUpload}
              backgroundImage={this.props.cover}
              isUploaded={this.props.cover !== undefined}
              resetUpload={this.resetUpload}
            />
          </UploadWrapper>
          <TourDescriptionWrapper>
            <Label>Tour Name*</Label>
            <Input
              value={this.props.name}
              onChange={evt => {
                this.props.updateName(evt.target.value);
              }}
            />
            <Label>Tour Organization*</Label>
            <Input
              value={this.props.organization}
              onChange={evt => {
                this.props.updateOrganization(evt.target.value);
              }}
            />
            <Label>Tour Caption*</Label>
            <Input
              value={this.props.caption}
              onChange={evt => {
                this.props.updateCaption(evt.target.value);
              }}
            />
            <Label>Loading Screen Preview</Label>
            <LoadingPreview
              name={this.props.name}
              organization={this.props.organization}
              caption={this.props.caption}
              color="#000000"
              backgroundImage={this.props.cover}
            />
          </TourDescriptionWrapper>
        </Grid>
        <BuildFooter stageMeta={this.props.stageMeta}>
          <NextButton
            disabled={this.props.disableNext}
            onClick={() => {
              if (!this.props.disableNext) {
                this.props.nextStage();
              }
            }}
          />
        </BuildFooter>
      </>
    );
  }
}

const Grid = styled.div`
  display: grid;
  grid-template-rows: 20vh 20h 20vh;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
`;

const UploadWrapper = styled.div`
  grid-column: 1/2;
  grid-row: 1/4;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 1.5rem;
`;
const Label = styled(sc.Span)`
  color: #3b4056;
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
`;

const Upload = styled(DragNDropImageUpload)`
  width: 500px;
  height: 500px;
`;

const TourDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  grid-column: 2/3;
  grid-row: 1/4;
  margin-top: 1.5rem;
`;

const Input = styled(sc.Input)`
  margin-bottom: 0.9rem;
`;

function mapStateToProps(state) {
  const { name, caption, organization } = state.tour;
  return {
    name,
    caption,
    organization,
    cover: state.tour.cover.img,
    disableNext: name.length * caption.length * organization.length === 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateName: name => {
      dispatch({ type: UPDATE_TOUR_NAME, payload: { name } });
    },
    updateCaption: caption => {
      dispatch({ type: UPDATE_TOUR_CAPTION, payload: { caption } });
    },
    updateOrganization: organization => {
      dispatch({ type: UPDATE_TOUR_ORGANIZATION, payload: { organization } });
    },
    updateCover: (file, img) => {
      dispatch({ type: UPDATE_TOUR_COVER, payload: { file, img } });
    },
    nextStage: () => {
      dispatch({ type: GOTO_NEXT_STAGE });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DescriptionStage);
