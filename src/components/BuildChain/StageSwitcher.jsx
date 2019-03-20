import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

class StageSwitcher extends Component {
  render() {
    const augmentedChildren = React.Children.map(
      this.props.children,
      (child, index) => {
        return React.cloneElement(child, {
          stageMeta: this.props.currentStage
        });
      }
    );
    const children = React.Children.toArray(augmentedChildren);

    return (
      <Wrapper>
        <>
          {children.filter(
            child => child.props.stage === this.props.currentStage.detail
          )}
        </>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  min-height: 900px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

function mapStateToProps(state) {
  return {
    currentStage: state.buildSession.currentStage
  };
}

export default connect(mapStateToProps)(StageSwitcher);
