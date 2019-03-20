import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Span, Button } from '../../../styles';
import { ADD_FLOOR } from '../../../constants/actionTypes';

export const CHEVRON_UP = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAIwklEQVR4nO2b76scVx3Gn++yXEIovhKRIPdFkBBCCOFSLiVcSgjhGi4llLTWGkrQ1F8B+1L8E3zhiyJSSiihBMFQSyxC9YWIoAhRag2ptCFJb+MlpjENpYLUtOnd78cXM5tOzp4zP/buzt6aeQ7L7J45c+Y5zzzne86cmTWEOkwfvVkTuF/QCd0SOqFbQid0S+iEbgmd0C2hE7oldEK3hE7oltAJ3RI6oVtCJ3RL6IRuCZ3QLaETuiV0QreETuiW0J81gUZAfUlb8l8fybQ+SzpN8JkRGueLJjsm6SuAS/q1XD+3nr03a261wGchwQPu/jN3v82n+NDdT7n7lpnzq5FmTqAywTbgNPAJAdz9Y+Ak8IWZ86xIMydQmmDe3c+4+8fuPhQ3FPs28CKwbeZ8S5Khzfm6Ac7nzOwF4FFJc5JkZvGy8JGZ/QI4YT37b5s8a2PWV3okQc/dt7v7K7FwEQkfw6+fAGfcfX7mbYikzTiP/pKkH5vZCpCcFQHh7z5wRNKPhLZNmWNjbK7QgT4v6QVJj6gw9QRGwkYsL8cdSb+UdEKmf0+PbDNsCkfj9IR2AqclHZbUHzq26NzQxcO8IH8OeFzSKZzt0+TdBJvD0WgeeM7MDqnGTVTRzSXf75jZq5KekendqXGvidkKnY0R85Kel3RQCZFLwsTdfUNXF8sB62b2G2VhZKZizyx04PQk7QJOSlpWLnIsPJRhKKyZ3SN4nteXtAI8j7NzQtTHwuwcjeYlnQL254IknVvm6GjVwcUyszuSfifpaZn+tRHa46J1oXMn7zCzk5KWNKFeFTj5bl7B5W5mv5d0QtI7MvkkzlsXswgdeyQ9pwYix2YgIYaho2RfT9J+ST+V1HoYadXRONvM7GVJiyrE5JgDg0GtcjCM5Usjg6PMbF3SH4Gvt7nE2oqjcXo4e83sV5L2ld3xjX2O0fn0yP4cfeCAmb0itLutu+O2QsdeST+RtBDuKDoudHOVeMXjw2NCJ4cAFoFngV2NWzMGpho6cHpmtl3Sy8pic+mFbTq7KDs+FZICrJvZ34DHrGf/HPvENTA1R+ezi0XgjDJHj32ulLPL8ovbYk8J5t19SYtm9pLQQs55KphaxWa2IOnZfHtP48PvYXcPy+T13a27WH4oYtWgWPxdPE+OxZzr7ok0PoKJh448XOySdBb4cj6tSpevCBepmUjd+hqs/LmktyR9FbhsPZvoPHuyjkY9M1uSdFrSjmH9oTtDF5et0BVFDntAzK0hivXHek4BPUm7Jb1oZouTno1M1NE4D5rZSWCvpF5sFnH3xJFZQU3nDd/lKF2AStVZA+uS/irpuzK90fTgFCZz1VBf6CEzOwssKBA5bHRK5FQcL2zfBb4t6RlJ74V1hOdIODd6nsK+PvCQpLNCCxNz9oafhkHf3Q+4+3l3J3xaXXxqXcwLy4Z5xWPyvOvAcWALsBX4nrvfjB2X4hHLTyHf/xdgCehtVKdJCL0P+DswKGtALD8laqTsh8BR4O7LMu6+FTju7rdDMavOV2aCYP/A3c8DCzMT2t37wAHgWihUSuiUY2NlCvlrwJPEXJU9Mf8GcD3VS1JCxz4lHK66+xLQb1do6AHLZE6uJWidcpHf14GnSl/7gq3ufhy4GV64KsFTwkaOGbj768B+xgwj4zi5BxwEVnMC0QbU/Z2K4cAt4Ii7z9XgNAccdfcPEnWNnC8ldskFGgCX3P3hccRu6uQ5YIWsO9chFxU5Va6Qtwo80aRB7t5392Puvlasq2qgrBNGAn6rwEF3bxRGmojcA1bc/SKBk2NipbpsVUgBbuQiN39LNJuNPEXWGxr3qFS5IG8AXCDr1bWNUNstwCO5CCMk67inqgH59hrZxRx70CGbBz/q7jcqzrURM+Du18jGqVpc6xCfy4mvxUgnSJROnRJx+ZK7H6lLvEpsdz9K1s1LBRxH/CDErdThXEW45+6HgSskwkXVoJIqF2xvAoeByoGvbnL3LWQh6P2YmCkuqbxQ8Hw7yEPpsruXhpEqJz8O/KdM1JjIqYElQfaKu++flMARwQ+5+9XEBY6aoawtiTo+AA6XhbwUuTngSXdfqxr0qvJSyElfrCK44fSpYa405VomdKTsKlmIjbYlRqyXN34tdRVDIlXfw7wca2Qj98TCRYXYKwR3kCnxarp4JIwAq+6+XFfoOeD1ssEs9r0BBsCbwP6pCxwkdz8EXEq1JRY6wgtQ1u48/w9EzDOyBAjZO3GlK37B8iKJxXiC5c78c1nSDyT9aSLLjw2Qv6n0Q0lvR/aNLOkWHzYMAen1+7z8LkWWn2NrrQ5cDl8DCAnF3gxKvGhY3L5tZt+U9NuZ/BnTdEfSq8DTkv4ReygQrmOn2jlEKLyZXQZGH4NFQkePbEnyRqq7VH2PbIfLja2Hi2TKpmRvpkJALD5XTQzc/Zq7H4lN9VIkHgC+TzZtqR2jU6LnDWq8PjDNlM+sVsiml0mxY+1KCH4L+BawNXa+MiJDZ9+qcnUJBrnIu5nAU4qJp6z3LhBM/ULBa4h807O72mQbq4j0ge/kXaJS1cAFA+A14OGZC1ot+LK7XyhrU0n7r7r7MSpuw+uQ2Er2rC66IhYjluOCuy9tpnBR0sY+2Zw+GrNL2n2D7OlP5UpjEzJHis4uiWsD4Ly775i5gM0F3z0cIKtu1ICrwErdupuQmAOOUVj0j2Dg7ufcfWnmoo2b4IBnj63K3LwKPNGktzYlMTd0dkggd8A5d3+QzTjw1W9jH9gXil1A5uSGSwfjkjnMvdOiAXDO3XfOXKgJJXffA7yWh8JhSLwIRNcyqtJ4r4ShPrBkZo8B82b2BvCSmb3V9p9wpoZseWKPpK8pW5J4R9mLm3+2njW+qx3/3buMSB/om9l6fnv7fwecOUkbbuPm+IvyfYBN8af7+wGd0C2hE7oldEK3hE7oltAJ3RI6oVtCJ3RL6IRuCZ3QLaETuiV0QreETuiW0AndEjqhW0IndEvohG4JndAt4X+KluzeYYX6ZwAAAABJRU5ErkJggg==`;
export const CHEVRON_DOWN = `data:image/png;base64,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`;

function padZero(input) {
  if (input.length === 1) {
    return `0${input}`;
  }

  return input;
}

const FloorChanger = props => {
  const grayBottom = props.currentFloor <= 1;
  const grayTop = props.currentFloor >= props.maxFloor;

  return (
    <Container>
      <Title>Floor</Title>
      <Chevron
        src={CHEVRON_UP}
        gray={grayTop}
        onClick={() => props.addFloor(1)}
      />
      <FloorSpan>{padZero('' + props.currentFloor)}</FloorSpan>
      <Chevron
        src={CHEVRON_DOWN}
        gray={grayBottom}
        onClick={() => props.addFloor(-1)}
      />
    </Container>
  );
};

const Title = styled.span`
  height: 16px;
  width: 44px;
  color: #ffffff;
  font-family: 'Spectral';
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1.67px;
  line-height: 16px;
  text-align: center;
  text-transform: uppercase;
`;

const Chevron = styled.img`
  height: 15px;
  width: 15px;
  cursor: pointer;
  ${props =>
    props.gray &&
    css`
      opacity: 0.2;
    `}
`;

const FloorSpan = styled.span`
  height: 49px;
  width: 32px;
  color: #ffffff;
  font-family: Spectral;
  font-size: 32px;
  line-height: 49px;
  text-align: center;
`;

const Container = styled.div`
  height: 97px;
  width: 64px;
  background-color: #4d575a;
  position: absolute;
  top: 0px;
  right: 0px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 5px;
`;

function mapStateToProps(state) {
  return {
    currentFloor: state.tourDesign.currentFloor,
    maxFloor: state.tourDesign.maxFloor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addFloor: delta => {
      dispatch({ type: ADD_FLOOR, payload: { delta } });
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FloorChanger);
