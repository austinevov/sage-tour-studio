import * as THREE from 'three';

import {
  PanoramaGraphNode,
  RotationHandler,
  ZoomHandler,
  FloorData
} from './types/index';
import Scene from './scene/index';
import SceneRenderer from './renderer/SceneRenderer';
import TourController from './controllers/TourController';
import MouseController from './controllers/MouseController';
import MousePicker from './controllers/MousePicker';
import { LOAD } from '../constants/events';
import Panorama from './scene/Panorama';
import * as Event from '../constants/events';
import Camera from './camera/Camera';
import Minimap from './Minimap';
import clamp from '../utils/clamp';
import SageTourInternal from './SageTourInternal';
import fetchTour, { TourData } from './fetchTour';

export interface SageTourOpts {
  imagePathRoot: string;
  rootId?: number;
  initialYawDegrees?: number;
  initialPitchDegrees?: number;
  disableControls?: boolean;
  forceLD?: boolean;
  hideUI?: boolean;
  isReplicated?: boolean;
}

const AcceptedEvents = [
  Event.ROTATION,
  Event.ZOOM,
  Event.WAYPOINT_CLICKED,
  Event.CHANGE_FLOOR
];

export let IS_REPLICATED = true;

export default class SageTour {
  _tour: SageTourInternal;
  constructor(
    container: HTMLDivElement,
    token: string,
    onLoad: () => void,
    opts: SageTourOpts
  ) {
    if (opts.isReplicated) {
      IS_REPLICATED = true;
    }
    fetchTour(token).then((data: TourData) => {
      this._tour = new SageTourInternal(
        container,
        data.panoramas,
        onLoad,
        opts,
        data.name
      );

      const allFloors = data.floorplans.map(fp => fp.floor).sort();
      const floorplanByFloor = floor => {
        return data.floorplans.filter(fp => fp.floor === floor)[0];
      };
      const floorplanDimensions = [data.viewBoxX, data.viewBoxY];
      const byFloor = {};
      allFloors.forEach(floor => {
        const fp = floorplanByFloor(floor);
        const points = {};
        data.panoramas.forEach(panorama => {
          if (panorama.floor === floor) {
            const [x, y, z] = panorama.floorplanPosition;
            const floorPosition = [x, z];
            points[panorama.id] = { floorPosition };
          }
        });
        byFloor[floor] = {
          src: fp.path,
          points,
          theta: (fp as any).theta
        };
      });
      const floorData: FloorData = {
        byFloor,
        allFloors,
        floorplanDimensions
      };
      this._tour.setFloorData(floorData);
      this._tour.addMinimap(floorData);
    });
  }

  public controller = (): TourController => {
    if (this._tour) {
      return this._tour.controller();
    }
  };

  public destroyDOM = () => {
    this._tour.destroyDOM();
  };

  public on = (
    type:
      | Event.ZOOM
      | Event.ROTATION
      | Event.WAYPOINT_CLICKED
      | Event.CHANGE_FLOOR
      | Event.CONTEXT_LOST,
    handler: (any) => void
  ): void => {
    if (this._tour) {
      return this._tour.on(type, handler);
    } else {
      document.addEventListener(LOAD, () => {
        return this._tour.on(type, handler);
      });
    }
  };

  public setEnableControls = (isEnabled: boolean): void => {
    if (this._tour) {
      this._tour.setEnableControls(isEnabled);
    }
  };

  public setFloor = (floor: number): void => {
    if (this._tour) {
      this._tour.setFloor(floor);
    }
  };

  public panoramas = (): { [key: number]: Panorama } => {
    if (this._tour) {
      return this._tour.panoramas();
    }

    return {};
  };

  public panoramaById = (id: number): Panorama => {
    if (this._tour) {
      return this._tour.panoramaById(id);
    }
  };

  public activePanorama = (): Panorama => {
    if (this._tour) {
      return this._tour.activePanorama();
    }
  };

  public camera = (): Camera => {
    if (this._tour) {
      return this._tour.camera();
    }
  };

  public maxFloor = (): number => {
    if (this._tour) {
      return this._tour.maxFloor();
    }
  };

  public minFloor = (): number => {
    if (this._tour) {
      return this._tour.minFloor();
    }
  };

  public changePanorama = (destinationId: number): void => {
    if (this._tour) {
      this._tour.changePanorama(destinationId);
    }
  };

  public updatePanoramaPosition = (
    id: number,
    position: { x: number; y: number; z: number }
  ): void => {
    if (this._tour) {
      this._tour.updatePanoramaPosition(id, position);
    }
  };

  public updatePanoramaThetaOffset = (id: number, offset: number): void => {
    if (this._tour) {
      this._tour.updatePanoramaThetaOffset(id, offset);
    }
  };

  public addPanoramaEdge = (start: number, finish: number): void => {
    if (this._tour) {
      this._tour.addPanoramaEdge(start, finish);
    }
  };

  public removePanoramaEdge = (start: number, finish: number): void => {
    if (this._tour) {
      this._tour.removePanoramaEdge(start, finish);
    }
  };

  public hotReload = (panoramaGraph: PanoramaGraphNode[]): void => {
    if (this._tour) {
      this._tour.hotReload(panoramaGraph);
    }
  };

  public setLock = (isLocked: boolean): void => {
    if (this._tour) {
      this._tour.setLock(isLocked);
    }
  };
}
