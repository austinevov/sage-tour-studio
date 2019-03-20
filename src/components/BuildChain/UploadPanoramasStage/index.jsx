import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import * as sc from '../../../styles';
import DragNDropImageUpload from '../../DragNDropImageUpload';
import { getAllByIds } from '../../../selectors/tour';
import {
  UPLOAD_PANORAMA,
  RENAME_PANORAMA,
  DELETE_PANORAMA,
  GOTO_NEXT_STAGE
} from '../../../constants/actionTypes';
import UploadTab from '../../UploadTab';
import BuildFooter, { NextButton } from '../BuildFooter';

class UploadPanoramasStage extends Component {
  uploadPanoramas = panoramas => {
    Array.from(panoramas).forEach(panorama => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.props.uploadPanorama(panorama, reader.result);
      };
      reader.readAsDataURL(panorama);
    });
  };

  render() {
    return (
      <>
        <Flex>
          <PanoramaUploadWrapper>
            <PanoramaUpload receiveUpload={this.uploadPanoramas} multiple />
          </PanoramaUploadWrapper>
          <PanoramaList>
            <span>Panoramas ({this.props.panoramas.length})</span>
            {this.props.panoramas.map((panorama, index) => (
              <UploadTab
                key={index}
                index={index}
                img={panorama.img}
                name={panorama.name}
                handleNameChange={name =>
                  this.props.renamePanorama(panorama.id, name)
                }
                destroyUpload={() => this.props.deletePanorama(panorama.id)}
              />
            ))}
          </PanoramaList>
        </Flex>
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

const PanoramaList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  border-top: 1px solid #3b4056;
  border-bottom: 1px solid #3b4056;
  > span {
    margin-top: 1rem;
    &:last-child {
      margin-bottom: 1rem;
    }
  }

  margin-bottom: 1rem;
`;

const PanoramaUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
`;
const PanoramaUpload = styled(DragNDropImageUpload)`
  width: 500px;
  height: 500px;
`;

const Flex = styled.div`
  margin-top: 1.5rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

function mapStateToProps(state) {
  const panoramas = getAllByIds(state.tour.panoramas);
  return {
    panoramas,
    disableNext: panoramas.length <= 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadPanorama: (file, img) => {
      dispatch({ type: UPLOAD_PANORAMA, payload: { file, img } });
    },
    renamePanorama: (id, name) => {
      dispatch({ type: RENAME_PANORAMA, payload: { id, name } });
    },
    deletePanorama: id => {
      dispatch({ type: DELETE_PANORAMA, payload: { id } });
    },
    nextStage: () => {
      dispatch({ type: GOTO_NEXT_STAGE });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadPanoramasStage);
