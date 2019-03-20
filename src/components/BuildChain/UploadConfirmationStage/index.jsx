import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import axios from 'axios';
require('formdata-polyfill');

import * as sc from '../../../styles';
import UploadTab from '../../UploadTab';
import { getAllByIds } from '../../../selectors/tour';
import BuildFooter, { UploadButton } from '../BuildFooter';
import { validateEmail } from '../../../utils/validateEmail';
import {
  UPDATE_ASSET_LOAD,
  GOTO_NEXT_STAGE
} from '../../../constants/actionTypes';

class UploadConfirmationStage extends Component {
  state = {
    email: '',
    reenteredEmail: '',
    isUploading: false
  };

  upload = async () => {
    this.setState({ isUploading: true });
    try {
      const response = await axios.post('/api/create-tour', {
        email: this.state.email
      });

      const { token, uploadSession } = response.data;

      const uploadAsset = (asset, url, length, index) => {
        const formData = new FormData();
        formData.set('tourToken', token);
        formData.set('uploadSession', uploadSession);
        formData.set('totalAssetCount', length);
        formData.set('index', index);
        formData.set('file', asset.file);
        formData.set('label', asset.name);
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: evt => {
            const percentCompleted = Math.round(evt.loaded / evt.total);
            this.props.updateAssetLoad(asset.id, percentCompleted);
          }
        };

        return axios.post(url, formData, config);
      };

      const promises = this.props.floorplans.map((asset, index) => {
        return uploadAsset(
          asset,
          '/api/upload-floorplan',
          this.props.floorplans.length,
          index
        );
      });

      promises.concat(
        this.props.panoramas.map((asset, index) => {
          return uploadAsset(
            asset,
            '/api/upload-panorama',
            this.props.panoramas.length,
            index
          );
        })
      );

      await Promise.all(promises);

      this.props.nextStage();
    } catch (err) {
      console.log(err);
    }
  };

  handleEmailChange = evt => {
    this.setState({ email: evt.target.value });
  };

  handleReenteredEmailChange = evt => {
    this.setState({ reenteredEmail: evt.target.value });
  };

  render() {
    return (
      <>
        <sc.Note>Please enter your email</sc.Note>
        <EmailWrapper>
          <Label>Your email*</Label>
          <sc.Input
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
          <Label>Re-enter your email*</Label>
          <sc.Input
            value={this.state.reenteredEmail}
            onChange={this.handleReenteredEmailChange}
          />
        </EmailWrapper>
        <sc.Note>Please review your tour assets before uploading</sc.Note>
        <Flex>
          <TourDescriptionWrapper>
            <Label>
              Tour Name: <DescriptionLabel>{this.props.name}</DescriptionLabel>
            </Label>
            <Label>
              Tour Organization:
              <DescriptionLabel>{this.props.organization}</DescriptionLabel>
            </Label>
          </TourDescriptionWrapper>
          <AssetList>
            <span>Assets ({this.props.assets.length})</span>
            {this.props.assets.map((asset, index) => (
              <UploadTab
                key={index}
                index={index}
                img={asset.img}
                name={asset.name}
                isLoading={asset.isLoading}
                percent={asset.loadPercent}
                noDelete
                noRename
                noDrop={this.state.isUploading}
              />
            ))}
          </AssetList>
        </Flex>
        <BuildFooter stageMeta={this.props.stageMeta}>
          <UploadButton
            disabled={
              this.state.email.length <= 0 ||
              this.state.email !== this.state.reenteredEmail ||
              !validateEmail(this.state.email)
            }
            onClick={this.upload}
          />
        </BuildFooter>
      </>
    );
  }
}

const EmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;

  > span:nth-of-type(2) {
    margin-top: 0.5rem;
  }
`;
const AssetList = styled.div`
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

const TourDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #efefef;
  padding: 1rem 1rem;

  span:not(:last-of-type) {
    margin-bottom: 0.6rem;
  }

  margin-bottom: 1rem;
`;

const Label = styled(sc.Span)`
  color: #3b4056;
  font-weight: 600;
  font-size: 0.8rem;
`;

const DescriptionLabel = styled(Label)`
  font-weight: 300;
`;

const Flex = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

function mapStateToProps(state) {
  const floorplans = getAllByIds(state.tour.floorplans);
  const panoramas = getAllByIds(state.tour.panoramas);
  const assets = floorplans.concat(panoramas);
  return {
    assets,
    floorplans,
    panoramas,
    name: state.tour.name,
    organization: state.tour.organization
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAssetLoad: (id, percent) => {
      dispatch({ type: UPDATE_ASSET_LOAD, payload: { id, percent } });
    },
    nextStage: () => {
      dispatch({ type: GOTO_NEXT_STAGE });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadConfirmationStage);
