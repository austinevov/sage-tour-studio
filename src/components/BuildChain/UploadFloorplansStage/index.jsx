import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import * as sc from '../../../styles';
import DragNDropImageUpload from '../../DragNDropImageUpload';
import { getAllByIds } from '../../../selectors/tour';
import {
  UPLOAD_FLOORPLAN,
  RENAME_FLOORPLAN,
  DELETE_FLOORPLAN,
  GOTO_NEXT_STAGE
} from '../../../constants/actionTypes';
import UploadTab from '../../UploadTab';
import BuildFooter, { NextButton } from '../BuildFooter';

class UploadFloorplansStage extends Component {
  uploadFloorplans = floorplans => {
    Array.from(floorplans).forEach(floorplan => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.props.uploadFloorplan(floorplan, reader.result);
      };
      reader.readAsDataURL(floorplan);
    });
  };

  render() {
    return (
      <>
        <sc.Note>
          Note: floorplans must be uploaded as .svg files in order to scale
          properly
        </sc.Note>
        <Flex>
          <FloorplanUploadWrapper>
            <FloorplanUpload
              receiveUpload={this.uploadFloorplans}
              multiple
              acceptFiles="image/svg+xml"
            />
          </FloorplanUploadWrapper>
          <FloorplanList>
            <span>Floorplans ({this.props.floorplans.length})</span>
            {this.props.floorplans.map((floorplan, index) => (
              <UploadTab
                key={index}
                index={index}
                img={floorplan.img}
                name={floorplan.name}
                handleNameChange={name =>
                  this.props.renameFloorplan(floorplan.id, name)
                }
                destroyUpload={() => this.props.deleteFloorplan(floorplan.id)}
              />
            ))}
          </FloorplanList>
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

const FloorplanList = styled.div`
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

const FloorplanUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
`;

const FloorplanUpload = styled(DragNDropImageUpload)`
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
  const floorplans = getAllByIds(state.tour.floorplans);
  return {
    floorplans,
    disableNext: floorplans.length <= 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadFloorplan: (file, img) => {
      dispatch({ type: UPLOAD_FLOORPLAN, payload: { file, img } });
    },
    renameFloorplan: (id, name) => {
      dispatch({ type: RENAME_FLOORPLAN, payload: { id, name } });
    },
    deleteFloorplan: id => {
      dispatch({ type: DELETE_FLOORPLAN, payload: { id } });
    },
    nextStage: () => {
      dispatch({ type: GOTO_NEXT_STAGE });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadFloorplansStage);
