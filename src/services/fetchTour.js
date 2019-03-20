import axios from 'axios';

export default tourToken => {
  return new Promise(resolve => {
    axios.get('/api/fetch-tour', { params: { tourToken } }).then(response => {
      if (!response.data || response.data.errors) {
        resolve({ error: 'Invalid tour id' });
      } else {
        const { viewBoxX, viewBoxY } = response.data;

        const floorplans = response.data.floorplans.map(
          ({ id, assetOriginal, floor, theta }) => {
            return { id, path: assetOriginal, floor, theta };
          }
        );

        const panoramas = response.data.panoramas.map(
          ({ id, floor, label, position, neighbors, isBayed }) => {
            return {
              id: parseInt(id),
              label: label || '',
              floor,
              position: [position.x, position.z],
              edges: neighbors || [],
              isBayed
            };
          }
        );

        resolve({ panoramas, floorplans, viewBoxX, viewBoxY });
      }
    });
  }).catch(err => {
    resolve({ error: 'Invalid tour id' });
  });
};
