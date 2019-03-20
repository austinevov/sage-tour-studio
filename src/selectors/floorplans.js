export function getAllFloorplans(state) {
  return state.floorplans.allIds.map(id => {
    return { ...state.floorplans.byId[id], id };
  });
}
