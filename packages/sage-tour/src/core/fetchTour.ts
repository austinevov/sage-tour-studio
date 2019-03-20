import axios from 'axios';
import { PanoramaGraphNode } from './types';

export interface TourData {
  panoramas: PanoramaGraphNode[];
  floorplans: {
    id: number;
    path: string;
    floor: number;
  }[];
  token: string;
}

export default (tourToken: string): Promise<TourData> => {
  return new Promise(resolve => {
    console.log('Fetching tour data using TH E token:', tourToken);
    axios.get('/api/fetch-tour', { params: { tourToken } }).then(response => {
      const panoramaGraph: PanoramaGraphNode[] = response.data.panoramas.map(
        panorama => {
          const floor = parseInt(panorama.floor);
          const id = parseInt(panorama.id);
          const position = [
            panorama.position.x,
            panorama.position.y,
            panorama.position.z
          ];
          const edges = panorama.neighbors.map(n => parseInt(n));
          const name = panorama.label;
          return {
            floor,
            id,
            position,
            edges,
            name
          };
        }
      );

      const floorplans = response.data.floorplans.map(fp => {
        return {
          id: parseInt(fp.id),
          path: fp.assetOriginal,
          floor: parseInt(fp.floor)
        };
      });

      resolve({
        panoramas: panoramaGraph,
        floorplans,
        token: tourToken
      });
    });
  });
};
