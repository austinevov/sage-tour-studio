import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { Button } from '../styles';

class DragNDropImageUpload extends Component {
  uploadFile = () => {
    this.uploader.click();
  };

  handleDragOver = evt => {
    evt.preventDefault();
    console.log(evt.dataTransfer);
  };

  handleDrop = evt => {
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    this.props.receiveUpload(files);
  };

  render() {
    console.log('Background image: ', this.props);
    return (
      <Wrapper
        className={this.props.className}
        backgroundImage={this.props.backgroundImage}
        onDragEnter={this.handleDragOver}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}>
        <InvisibleFileUpload
          onChange={() => this.props.receiveUpload(this.uploader.files)}
          type="file"
          id="file-upload"
          multiple={this.props.multiple}
          accept={this.props.acceptFiles ? this.props.acceptFiles : 'image/*'}
          ref={uploader => {
            this.uploader = uploader;
          }}
        />
        {!this.props.isUploaded && (
          <>
            <InstructionSpan>Drag and Drop Files</InstructionSpan>
            <PlusSign onClick={this.uploadFile}>
              <span>&#43;</span>
            </PlusSign>
            <UploadFilesButton onClick={this.uploadFile}>
              Upload Files
            </UploadFilesButton>{' '}
          </>
        )}
        {this.props.isUploaded && (
          <DestroyButton onClick={this.props.resetUpload}>🗑️</DestroyButton>
        )}
      </Wrapper>
    );
  }
}
const DestroyButton = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 32px;

  cursor: pointer;
`;
const InvisibleFileUpload = styled.input`
  display: none;
`;
const Wrapper = styled.div`
  position: relative;
  background-color: #f7f8fc;
  border: 2px dashed #3b4056;

  width: 400px;
  height: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${props =>
    css`
      background-image: url('${props.backgroundImage}');
    `}

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;
const InstructionSpan = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #3b4056;
  margin-bottom: 2rem;
`;
const UploadFilesButton = styled(Button)`
  background-color: #fe585a;
  color: #121212;

  color: white;
  font-weight: 300;
  text-transform: uppercase;

  border-radius: 4px;
  padding-top: 10px;
  padding-bottom: 10px;

  &:hover {
    background-color: #a90103;
  }
`; // 4b5066
const PlusSign = styled.div`
  width: 150px;
  height: 150px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 2px dashed #aba0a6;
  color: #aba0a6;
  span {
    text-align: center;
    font-size: 72px;
    position: relative;
    top: 2.5px;
  }
  margin-bottom: 2rem;
  cursor: pointer;
`;
export default DragNDropImageUpload;
