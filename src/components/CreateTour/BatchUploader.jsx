import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import * as sc from '../../styles';
import { UPLOAD_FLOORPLAN, UPLOAD_PANORAMA } from '../../constants/actionTypes';
import { getAllByIds } from '../../selectors/tour';
import AssetTab from './AssetTab';

const instanceData = {
  panorama: {
    titleFragment: 'panorama',
    fileTypes: 'image/*',
    instructions: 'Upload image files'
  },
  floorplan: {
    titleFragment: 'floor plan',
    fileTypes: 'image/svg+xml',
    instructions: 'Must be in SVG format'
  }
};

class BatchUploader extends Component {
  uploadFile = () => {
    this.uploader.click();
  };

  shouldComponentUpdate = (nextState, nextProps) => {
    return true;
  };

  receiveUpload = files => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.props.uploadFile(file, reader.result, this.props.name);
      };
      reader.readAsDataURL(file);
    });
  };

  render() {
    const uploadedIds =
      this.props.name === 'panorama'
        ? this.props.panoramas
        : this.props.floorplans;

    return (
      <Container>
        <InvisibleFileUpload
          onChange={() => this.receiveUpload(this.uploader.files)}
          type='file'
          id='file-upload'
          multiple={true}
          accept={instanceData[this.props.name].fileTypes}
          ref={uploader => {
            this.uploader = uploader;
          }}
        />
        <Header>
          <UploaderDetails>
            <H1>Upload {instanceData[this.props.name].titleFragment}</H1>
            <Instructions>
              {instanceData[this.props.name].instructions}
            </Instructions>
          </UploaderDetails>
          <UploadButton
            onClick={this.uploadFile}
            disabled={this.props.disabled}
          >
            <img src='/upload.svg' />
          </UploadButton>
        </Header>
        <UploadList>
          {uploadedIds.map(assetId => (
            <AssetTab
              key={`ev-asset-${this.props.name}-${assetId}`}
              assetId={assetId}
              name={this.props.name}
            />
          ))}
        </UploadList>
      </Container>
    );
  }
}

const UploadList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2px solid #4d575a;
`;

const UploaderDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
`;

const InvisibleFileUpload = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  img {
    height: 40px;
    width: 40px;
  }
`;

const H1 = styled(sc.Span)`
  color: #4d575a;
  font-family: Spectral;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2.33px;
  line-height: 21px;
  text-transform: uppercase;
`;

const Instructions = styled(sc.Span)`
  color: #4d575a;
  font-family: Spectral;
  font-size: 12px;
  font-style: italic;
  line-height: 19px;
`;

const Container = styled.div`
  width: 330px;
  height: 200px;
  overflow-y: auto;
  margin: 30px 20px;
`;

function mapStateToProps(state) {
  const floorplans = state.tour.floorplans.allIds;
  const panoramas = state.tour.panoramas.allIds;
  return { floorplans, panoramas };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadFile: (file, img, name) => {
      if (name === 'panorama') {
        dispatch({ type: UPLOAD_PANORAMA, payload: { file, img } });
      } else if (name === 'floorplan') {
        dispatch({ type: UPLOAD_FLOORPLAN, payload: { file, img } });
      }
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchUploader);
