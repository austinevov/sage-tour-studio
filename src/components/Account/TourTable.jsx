import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import axios from 'axios';
import {
  ACTIVATE_CONFIRMATION,
  BEGIN_MEDIA_UPDATE
} from '../../constants/actionTypes';

class TourTable extends Component {
  state = {
    rows: []
  };

  componentDidMount = () => {
    this.fetchRowLoop();
  };

  removeTour = token => {
    axios
      .delete(`/api/delete-tour/${token}`, {
        withCredentials: true
      })
      .then(response => {
        if (response.status === 200) {
          const rows = this.state.rows.filter(row => row.token !== token);
          this.setState({ rows });
        }
      })
      .catch(err => {});
  };

  fetchRowLoop = () => {
    this.fetchRows();
    setTimeout(this.fetchRowLoop, 7000);
  };

  fetchRows = () => {
    axios
      .get('/api/fetch-all-tours', { withCredentials: true })
      .then(response => {
        const rows = response.data.tourData.map(data => {
          return {
            name: data.name,
            buildingName: data.buildingName,
            dateCreated: data.dateCreated,
            floorplanCount: data.floorplanCount,
            panoramaCount: data.panoramaCount,
            token: data.token,
            status: data.status || 'Unknown',
            disabled: (data.status || '').toLowerCase() !== 'ready'
          };
        });
        this.setState({ rows });
      });
  };

  render() {
    return (
      <Table>
        <HeaderCell gr='1/2' gc='1/2'>
          My Tours
        </HeaderCell>
        <HeaderCell gr='1/2' gc='2/3'>
          Building/Project
        </HeaderCell>
        <HeaderCell gr='1/2' gc='3/4'>
          Status
        </HeaderCell>

        <HeaderCell gr='1/2' gc='4/5'>
          Floor Plans
        </HeaderCell>
        <HeaderCell gr='1/2' gc='5/6'>
          Panoramas
        </HeaderCell>
        <HeaderCell gr='1/2' gc='6/7'>
          Share
        </HeaderCell>
        <HeaderCell gr='1/2' gc='7/8'>
          Edit
        </HeaderCell>
        <HeaderCell gr='1/2' gc='8/9'>
          Remove
        </HeaderCell>
        {this.state.rows.map((row, index) => {
          const even = index % 2 === 0;
          const r = `${index + 2}/${index + 3}`;
          return (
            <>
              <Cell style={{ gridRow: `${r}`, gridColumn: '1/2' }} even={even}>
                {row.name}
              </Cell>
              <Cell style={{ gridRow: `${r}`, gridColumn: '2/3' }} even={even}>
                {row.buildingName}
              </Cell>
              <Cell style={{ gridRow: `${r}`, gridColumn: '3/4' }} even={even}>
                {row.status.toUpperCase()}
              </Cell>

              <Cell
                style={{ gridRow: `${r}`, gridColumn: '4/5' }}
                underline
                even={even}
                onClick={() =>
                  this.props.beginMediaUpdate('floorplans', row.token)
                }
              >
                {`${row.floorplanCount} floorplans`}
              </Cell>
              <Cell
                style={{ gridRow: `${r}`, gridColumn: '5/6' }}
                underline
                even={even}
                onClick={() =>
                  this.props.beginMediaUpdate('panoramas', row.token)
                }
              >
                {`${row.panoramaCount} panoramas`}
              </Cell>
              <Cell style={{ gridRow: `${r}`, gridColumn: '6/7' }} even={even}>
                <ShareButton
                  disabled={row.disabled}
                  onClick={() => {
                    if (!row.disabled) {
                      this.props.dispatch(push(`/v/${row.token}`));
                    }
                  }}
                >
                  <img src='/shareLink.svg' />
                </ShareButton>
              </Cell>
              <Cell style={{ gridRow: `${r}`, gridColumn: '7/8' }} even={even}>
                <EditButton
                  disabled={row.disabled}
                  onClick={() => {
                    if (!row.disabled) {
                      this.props.dispatch(push(`/t/${row.token}`));
                    }
                  }}
                >
                  <img src='/edit.svg' />
                </EditButton>
              </Cell>
              <Cell style={{ gridRow: `${r}`, gridColumn: '8/9' }} even={even}>
                <GarbageButton
                  disabled={row.disabled}
                  onClick={() => {
                    if (!row.disabled) {
                      this.removeTour(row.token);
                    }
                  }}
                >
                  <img src='/trash.svg' />
                </GarbageButton>
              </Cell>
            </>
          );
        })}
      </Table>
    );
  }
}

const RoundBlackButton = styled.button`
  ${props =>
    props.disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
  width: 28px;
  height: 28px;
  outline: none;
  border: none;

  border-radius: 50%;
  background-color: #4d575a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 28px;
    height: 28px;
  }
  cursor: pointer;
`;
const ShareButton = styled(RoundBlackButton)``;
const EditButton = styled(RoundBlackButton)``;
const GarbageButton = styled(RoundBlackButton)`
  img {
    width: 16px;
    height: 16px;
  }
`;
const Cell = styled.div`
  ${props =>
    props.gc &&
    css`
      grid-column: ${props.gc};
    `};
  ${props =>
    props.gr &&
    css`
      grid-row: ${props.gr};
    `};

  ${props =>
    props.underline &&
    css`
      text-decoration: underline;
      cursor: pointer;
    `};

  ${props =>
    props.even &&
    css`
      background-color: #e5e6e7;
    `};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 24px;

  font-size: 14px;
`;

const HeaderCell = styled(Cell)`
  color: #4d575a;
  font-family: Spectral;
  font-size: 16px;
  font-weight: 600;
  border-top: 2px solid #4d575a;

  border-bottom: 2px solid #4d575a;
`;

const Table = styled.div`
  width: 1000px;
  display: grid;
  grid-auto-rows: 50px;
  grid-template-columns: repeat(8, auto);
  padding-bottom: 50px;
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    removeTour: token => {
      dispatch({
        type: ACTIVATE_CONFIRMATION,
        payload: {
          type: 'REMOVE_TOUR',
          token
        }
      });
    },
    beginMediaUpdate: (type, token) => {
      dispatch({ type: BEGIN_MEDIA_UPDATE, payload: { type, token } });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourTable);
