import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { TRASHCAN } from '../constants/base64';

class UploadTab extends Component {
  state = {
    isDropdown: true,
    loading: 0
  };

  componentDidMount = () => {};

  dropdown = () => {
    if (!this.props.noDrop) {
      this.setState({ isDropdown: !this.state.isDropdown });
    }
  };

  render() {
    return (
      <Wrapper>
        <TabBar>
          <OrdinalSpan>{this.props.index + 1}</OrdinalSpan>
          <NameInput
            value={this.props.name}
            onChange={evt => {
              this.props.handleNameChange(evt.target.value);
            }}
            disabled={this.props.noRename}
            noRename={this.props.noRename}
          />
          {!this.props.noDelete && (
            <Trashcan src={TRASHCAN} onClick={this.props.destroyUpload} />
          )}
          {this.props.isLoading && (
            <LoadingIndicator percent={this.props.percent * 100} />
          )}
          <DropdownSpan flip={this.state.isDropdown} onClick={this.dropdown}>
            ⯆
          </DropdownSpan>
        </TabBar>
        {this.state.isDropdown && !this.props.noDrop && (
          <Dropdown src={this.props.img} />
        )}
      </Wrapper>
    );
  }
}

const LoadingIndicator = styled.div`
  background-color: #1ed390;
  height: 100%;
  ${props =>
    css`
      width: ${props.percent}%;
    `};
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 5px 20px;
  border-radius: 20px;
  border: 2px solid #ced4ec;
  z-index: 1 !important;
`;

const Trashcan = styled.img`
  margin-left: 1rem;
  width: 20px;
  cursor: pointer;
  text-align: center;
  margin-right: 0.5rem;
`;

const Wrapper = styled.div`
  * {
    box-sizing: border-box;
  }
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const Dropdown = styled.img`
  width: 96%;
  max-height: 400px;
  box-shadow: 0px 0px 49px -27px rgba(0, 0, 0, 0.75);
`;

const TabBar = styled.div`
  position: relative;
  width: 100%;
  background-color: #f7f8fc;
  padding: 10px 0px;
  padding-right: 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 20px;
  border-radius: 20px;
  border: 2px solid #ced4ec;

  span {
    color: #3b4056;
  }
`;

const OrdinalSpan = styled.span`
  text-align: left;
  margin-right: 1rem;
  z-index: 2;
`;

const DropdownSpan = styled.span`
  margin-left: 0.5rem;
  text-align: right;
  font-size: 20px;
  cursor: pointer;
  transition: transform 500ms ease-in-out;
  z-index: 2;

  ${props =>
    props.flip &&
    css`
      transform: rotateZ(180deg);
    `};
`;

const NameInput = styled.input`
  z-index: 2;

  flex-grow: 1;
  background-color: transparent;

  border: 1px dashed #3b4056;
  outline: none;
  text-align: center;
  font-size: 18px;

  ${props =>
    props.noRename &&
    css`
      border: 0px;
    `};
`;

export default UploadTab;
