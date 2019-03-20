export function getAllPanoramas(state) {
  return state.panoramas.allIds.map(id => {
    return { ...state.panoramas.byId[id], id };
  });
}
