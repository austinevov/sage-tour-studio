import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import axios from 'axios';

import { END_MEDIA_UPDATE } from '../constants/actionTypes';

const media = {
  id: 0,
  src: ''
};
class TourMediaModal extends Component {
  state = {
    floorplans: [],
    panoramas: []
  };

  componentDidMount = () => {
    this.fetch();
  };

  fetch = () => {
    axios
      .get('/api/fetch-tour', {
        withCredentials: true,
        params: { tourToken: this.props.media.token }
      })
      .then(response => {
        if (response.status !== 200) {
          return this.props.endMediaUpdate();
        }

        const panoramas = response.data.panoramas.map(pano => {
          return {
            id: pano.id,
            src: pano.assetOriginal,
            label: pano.label
          };
        });

        const floorplans = response.data.floorplans.map(fp => {
          return {
            id: fp.id,
            src: fp.assetOriginal,
            label: `floor-${fp.floor}`,
            floor: fp.floor
          };
        });

        this.setState({
          panoramas,
          floorplans
        });
      })
      .catch(err => {
        this.props.endMediaUpdate();
      });
  };

  uploadFile = () => {
    this.uploader.click();
  };

  deleteAsset = id => {
    const route =
      this.props.media.type === 'floorplans'
        ? `delete-floorplan`
        : `delete-panorama`;
    axios
      .delete(`/api/${route}/${id}`, {
        withCredentials: true,
        params: { tourToken: this.props.media.token, id }
      })
      .then(response => {
        if (response.status === 200) {
          this.fetch();
        }
      });
  };

  uploadToServer = (file, buffer) => {
    const uploadAsset = (asset, url, length, index) => {
      const formData = new FormData();
      formData.set('tourToken', this.props.media.token);
      formData.set('totalAssetCount', length);
      formData.set('index', index);
      formData.set('file', asset.file);
      formData.set('label', asset.name);
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      return axios.post(url, formData, config);
    };
    const route =
      this.props.media.type === 'floorplans'
        ? 'upload-floorplan'
        : 'upload-panorama';
    let index = 0;
    if (
      this.props.media.type === 'floorplans' &&
      this.state.floorplans.length > 0
    ) {
      let maxFloor = 0;
      this.state.floorplans.forEach(fp => {
        maxFloor = Math.max(maxFloor, Number(fp.floor));
      });
      index = Math.max(0, maxFloor);
    }
    uploadAsset(
      { file: file, name: file.name },
      `/api/${route}`,
      1,
      index
    ).then(response => {
      this.uploader.value = null;
      this.fetch();
    });
  };

  receiveUpload = files => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        //this.props.uploadFile(file, reader.result, this.props.name);
        this.uploadToServer(file, reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  render() {
    const media =
      this.props.media.type === 'floorplans'
        ? this.state.floorplans
        : this.state.panoramas;
    const filetype =
      this.props.media.type === 'floorplans' ? 'image/svg+xml' : 'image/*';

    return (
      <BackDrop onClick={() => this.props.endMediaUpdate()}>
        <Container onClick={evt => evt.stopPropagation()}>
          <Header>
            <span>Update {this.props.media.type}</span>
            <ExitButton onClick={() => this.props.endMediaUpdate()}>
              &times;
            </ExitButton>
          </Header>
          <MediaList>
            {media.map(m => {
              return (
                <MediaContainer>
                  <a href={m.src} target='_blank'>
                    <span>{m.label}</span>
                  </a>
                  <RoundButton onClick={() => this.deleteAsset(m.id)}>
                    <img src='/trash.svg' />
                  </RoundButton>
                </MediaContainer>
              );
            })}
            <MediaContainer pointer onClick={this.uploadFile}>
              <span>
                Add new{' '}
                {this.props.media.type.substr(
                  0,
                  this.props.media.type.length - 1
                )}
                ...
              </span>
              <RoundButton>+</RoundButton>
            </MediaContainer>
          </MediaList>
          <InvisibleFileUpload
            onChange={() => this.receiveUpload(this.uploader.files)}
            type='file'
            id='file-upload'
            multiple={false}
            accept={filetype}
            ref={uploader => {
              this.uploader = uploader;
            }}
          />
        </Container>
      </BackDrop>
    );
  }
}

const InvisibleFileUpload = styled.input`
  display: none;
`;

const MediaList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  padding: 15px 0px;
`;

const MediaContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  background-color: white;
  padding: 10px 5px;

  ${props =>
    props.pointer &&
    css`
      cursor: pointer;
    `}

  &:nth-child(even) {
    background-color: #e5e6e7;
  }

  > *:first-child {
    flex-grow: 1;
  }
`;

const RoundButton = styled.button`
  width: 24px;
  height: 24px;
  outline: none;
  border: none;

  border-radius: 50%;
  background-color: #4d575a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.6em;
  img {
    width: 12px;
    height: 12pxpx;
  }
  cursor: pointer;
`;

const ExitButton = styled(RoundButton)`
  font-size: 2.4em;
  background-color: transparent;
  cursor: pointer;
`;

const BackDrop = styled.div`
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

const Container = styled.div`
  width: 70vw;
  position: relative;

  min-height: 100px;
  max-width: 500px;
  box-shadow: 5px 5px 2px 0px rgba(0, 0, 0, 0.75);

  background-color: white;
  padding: 10px 10px;
  color: #4d575a;
  background-color: whitesmoke;
  border: 1px solid #4d575a;
  font-family: 'Spectral';

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const Header = styled.div`
  span {
    font-size: 1.5em;
    font-weight: bold;
    text-align: left;
    flex-grow: 1;
  }

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    endMediaUpdate: () => {
      dispatch({ type: END_MEDIA_UPDATE });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourMediaModal);
