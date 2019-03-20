import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import SageLogo from '../SageLogo';
import StageSwitcher from './StageSwitcher';
import DescriptionStage from './DescriptionStage';
import Stage from './Stage';
import UploadFloorplansStage from './UploadFloorplansStage';
import UploadPanoramasStage from './UploadPanoramasStage';
import UploadConfirmationStage from './UploadConfirmationStage';
import ConclusionStage from './ConclusionStage';

const BuildChain = props => (
  <>
    <SageLogo />
    <StageWrapper>
      <StageSwitcher>
        <Stage stage="description" component={<DescriptionStage />} />
        <Stage
          stage="upload-floorplans"
          component={<UploadFloorplansStage />}
        />
        <Stage stage="upload-panoramas" component={<UploadPanoramasStage />} />
        <Stage
          stage="upload-confirmation"
          component={<UploadConfirmationStage />}
        />
        <Stage stage="conclusion" component={<ConclusionStage />} />
      </StageSwitcher>
    </StageWrapper>
  </>
);

const StageWrapper = styled.div`
  padding: 4vh 4vw;
`;

export default BuildChain;
