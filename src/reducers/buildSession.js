import { GOTO_NEXT_STAGE } from '../constants/actionTypes';

const ConclusionStageNode = {
  detail: 'conclusion',
  footerDetail: 'Congratulations',
  depth: 5,
  next: null
};

const UploadConfirmationStageNode = {
  detail: 'upload-confirmation',
  footerDetail: 'Confirmation',
  depth: 4,
  next: ConclusionStageNode
};

const UploadPanoramaStageNode = {
  detail: 'upload-panoramas',
  footerDetail: 'Upload Panoramas',
  depth: 3,
  next: UploadConfirmationStageNode
};

const UploadFloorplanStageNode = {
  detail: 'upload-floorplans',
  footerDetail: 'Upload Floorplans',
  depth: 2,
  next: UploadPanoramaStageNode
};

const DescriptionStageNode = {
  detail: 'description',
  footerDetail: 'Tour Description',
  depth: 1,
  next: UploadFloorplanStageNode
};

const initialState = {
  currentStage: DescriptionStageNode
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GOTO_NEXT_STAGE: {
      return Object.assign({}, state, {
        currentStage: state.currentStage.next
      });
    }
  }

  return state;
};
