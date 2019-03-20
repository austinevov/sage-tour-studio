import Panorama from '../components/panorama';
import axios from 'axios';

export interface TourData {
  panoramas: Panorama[];
  floorplans: {
    id: number;
    path: string;
    floor: number;
  }[];
  token: string;
}

export default (tourToken: string): Promise<TourData> => {
  return new Promise(resolve => {
    console.log('Fetching tour data using token:', tourToken);
    axios.get('/api/fetch-tour', { params: { tourToken } }).then(response => {
      const floorplans = response.data.floorplans.map(
        ({ id, assetOriginal, floor }) => {
          return { id, path: assetOriginal, floor };
        }
      );

      const panoramas = response.data.panoramas.map(({ id, floor, label }) => {
        return new Panorama(parseInt(id), label, floor);
      });

      resolve({ panoramas, floorplans, token: tourToken });
    });
  });
};
