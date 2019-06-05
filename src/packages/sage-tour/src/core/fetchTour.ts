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
  viewBoxX: number;
  viewBoxY: number;
  name: string;
}

function rotateVector(input: number[], theta: number): number[] {
  const [vx, vy] = input;

  const x = vx * Math.cos(theta) - Math.sin(theta) * vy;
  const y = vx * Math.sin(theta) + Math.cos(theta) * vy;

  return [x, y];
}

export default (tourToken: string): Promise<TourData> => {
  return new Promise(resolve => {
    axios
      .get('/api/fetch-tour', {
        params: { tourToken }
      })
      .then(response => {
        const floorplans = response.data.floorplans.map(fp => {
          return {
            id: parseInt(fp.id),
            path: fp.assetOriginal,
            floor: parseInt(fp.floor),
            theta: parseFloat(fp.theta)
          };
        });

        const name = response.data.name;

        const fpByFloor = (floor: number) => {
          return floorplans.filter(fp => fp.floor === floor)[0];
        };

        const panoramaGraph: PanoramaGraphNode[] = response.data.panoramas.map(
          panorama => {
            const floor = parseInt(panorama.floor);
            const theta = fpByFloor(floor).theta;
            const id = parseInt(panorama.id);

            const { x, y, z } = panorama.position;

            const position = [x, y, z];
            const floorplanPosition = [
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
              name,
              floorplanPosition
            };
          }
        );

        let { viewBoxX, viewBoxY } = response.data;
        viewBoxX = parseInt(viewBoxX);
        viewBoxY = parseInt(viewBoxY);
        resolve({
          panoramas: panoramaGraph,
          floorplans,
          token: tourToken,
          viewBoxX,
          viewBoxY,
          name
        });
      });
  });
};
