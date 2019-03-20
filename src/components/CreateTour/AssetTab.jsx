import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Span } from '../../styles';
import {
  RENAME_PANORAMA,
  RENAME_FLOORPLAN,
  DELETE_FLOORPLAN,
  DELETE_PANORAMA
} from '../../constants/actionTypes';

class AssetTab extends React.Component {
  shouldComponentUpdate = (nextState, nextProps) => {
    return true;
  };
  render() {
    return (
      <Container key={this.props.key}>
        <Label>{this.props.asset.file.name}</Label>
        <NameInput
          value={this.props.asset.name}
          onChange={evt =>
            this.props.renameAsset(
              this.props.asset.id,
              evt.target.value,
              this.props.name
            )
          }
        />
        <DeleteButton
          onClick={() =>
            this.props.removeAsset(this.props.assetId, this.props.name)
          }>
          &times;
        </DeleteButton>
      </Container>
    );
  }
}

const Label = styled(Span)`
  color: #4d575a;
  font-family: Spectral;
  font-size: 12px;
  line-height: 19px;

  flex-grow: 1;
`;

const NameInput = styled.input`
  background-color: transparent;
  border: 1px dashed #4d575a;
  outline: none;
  color: #4d575a;
  font-family: Spectral;
  font-size: 12px;
  line-height: 19px;
  width: 12em;

  text-align: center;
`;

const DeleteButton = styled.button`
  cursor: pointer;
  color: #4d575a;
  font-family: Spectral;
  font-size: 28px;
  line-height: 19px;
  font-weight: 500;
  background-color: transparent;
  outline: none;
  border: none;
`;

const Container = styled.div`
  width: 100%;
  height: 38px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  border-bottom: 1px solid #4d575a;
`;

function mapStateToProps(state, ownProps) {
  const id = ownProps.assetId;
  const name = `${ownProps.name}s`;

  return {
    asset: state.tour[name].byId[id]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    renameAsset: (id, name, type) => {
      if (type === 'panorama') {
        dispatch({ type: RENAME_PANORAMA, payload: { id, name } });
      } else if (type === 'floorplan') {
        dispatch({ type: RENAME_FLOORPLAN, payload: { id, name } });
      }
    },
    removeAsset: (id, type) => {
      if (type === 'floorplan') {
        dispatch({ type: DELETE_FLOORPLAN, payload: { id } });
      } else if (type === 'panorama') {
        dispatch({ type: DELETE_PANORAMA, payload: { id } });
      }
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetTab);
