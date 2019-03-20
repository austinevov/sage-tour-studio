import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import axios from 'axios';

class TourTable extends Component {
  state = {
    rows: []
  };

  componentDidMount = () => {
    this.fetchRows();
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
            token: data.token
          };
        });
        this.setState({ rows });
      });
  };

  render() {
    return (
      <Table>
        <HeaderCell gr="1/2" gc="1/2">
          My Tours
        </HeaderCell>
        <HeaderCell gr="1/2" gc="2/3">
          Building/Project
        </HeaderCell>
        <HeaderCell gr="1/2" gc="3/4">
          Date Created
        </HeaderCell>
        <HeaderCell gr="1/2" gc="4/5">
          Tour Points
        </HeaderCell>
        <HeaderCell gr="1/2" gc="5/6">
          Floor Plans
        </HeaderCell>
        <HeaderCell gr="1/2" gc="6/7">
          Panoramas
        </HeaderCell>
        <HeaderCell gr="1/2" gc="7/8">
          Share
        </HeaderCell>
        <HeaderCell gr="1/2" gc="8/9">
          Edit
        </HeaderCell>
        {this.state.rows.map((row, index) => {
          const even = index % 2 === 0;
          const r = `${index + 2}/${index + 3}`;
          return (
            <>
              <Cell gr={r} gc="1/2" even={even}>
                {row.name}
              </Cell>
              <Cell gr={r} gc="2/3" even={even}>
                {row.buildingName}
              </Cell>
              <Cell gr={r} gc="3/4" even={even}>
                01/01/2019
              </Cell>
              <Cell gr={r} gc="4/5" even={even}>
                {`${row.panoramaCount} points`}
              </Cell>
              <Cell gr={r} gc="5/6" underline even={even}>
                {`${row.floorplanCount} floorplans`}
              </Cell>
              <Cell gr={r} gc="6/7" underline even={even}>
                {`${row.panoramaCount} panoramas`}
              </Cell>
              <Cell gr={r} gc="7/8" even={even}>
                <ShareButton
                  onClick={() => this.props.dispatch(push(`/v/${row.token}`))}>
                  <img src="/shareLink.svg" />
                </ShareButton>
              </Cell>
              <Cell gr={r} gc={8 / 9} even={even}>
                <EditButton
                  onClick={() => this.props.dispatch(push(`/t/${row.token}`))}>
                  <img src="/edit.svg" />
                </EditButton>
              </Cell>
            </>
          );
        })}
      </Table>
    );
  }
}

const RoundBlackButton = styled.button`
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
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourTable);
