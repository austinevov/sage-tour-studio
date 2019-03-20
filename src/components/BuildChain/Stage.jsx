import React from 'react';
import styled, { css } from 'styled-components';

import * as sc from '../../styles';

const Stage = props => {
  console.log(props);
  return (
    <Wrapper>
      <sc.Header fontWeight="300" fontSize="1.8rem" color="#3b4056" p="0" m="0">
        {props.stageMeta.footerDetail}
      </sc.Header>
      <ChildrenWrapper>
        {React.cloneElement(props.component, { stageMeta: props.stageMeta })}
      </ChildrenWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  box-sizing: border-box;

  width: fit-content;
  background-color: white;
  border-radius: 8px;

  padding: 40px 40px;
  box-shadow: 0px 0px 49px -27px rgba(0, 0, 0, 0.75);
  margin-top: 5rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const ChildrenWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
`;

export default Stage;
