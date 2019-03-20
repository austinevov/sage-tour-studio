export function getAllByIds({ byId, allIds }) {
  return allIds.map(id => byId[id]);
}

export function getTour(state) {
  const tour = state.tour;
  const name = tour.name;
  const buildingName = tour.buildingName;
  const description = tour.description;
  const floorplans = tour.floorplans.allIds.map(id => tour.floorplans.byId[id]);
  const panoramas = tour.panoramas.allIds.map(id => tour.panoramas.byId[id]);

  return {
    name,
    buildingName,
    description,
    floorplans,
    panoramas
  };
}
