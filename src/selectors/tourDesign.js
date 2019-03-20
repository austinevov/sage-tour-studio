export function getFloorplanByFloor(state, floor) {
  const floorplans = state.tourDesign.floorplans;
  const floorplan = floorplans.filter(fp => fp.floor === floor)[0];

  return floorplan;
}

export function getUpdatedTour(state) {
  const tour = state.tourDesign;
  const panoramas = tour.panoramas.allIds.map(id => tour.panoramas.byId[id]);

  const { token, viewBoxX, viewBoxY, floorplans } = tour;

  return {
    token,
    panoramas,
    floorplans,
    viewBoxX,
    viewBoxY
  };
}
