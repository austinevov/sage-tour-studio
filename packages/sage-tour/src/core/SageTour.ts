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
}

const AcceptedEvents = [
  Event.ROTATION,
  Event.ZOOM,
  Event.WAYPOINT_CLICKED,
  Event.CHANGE_FLOOR
];

export default class SageTour {
  _tour: SageTourInternal;
  constructor(
    container: HTMLDivElement,
    token: string,
    onLoad: () => void,
    opts: SageTourOpts
  ) {
    fetchTour(token).then((data: TourData) => {
      this._tour = new SageTourInternal(
        container,
        data.panoramas,
        onLoad,
        opts
      );
    });
  }

  public addMinimap = (floorData: FloorData): void => {
    if (this._tour) {
      this._tour.addMinimap(floorData);
    }
  };

  public controller = (): TourController => {
    if (this._tour) {
      return this._tour.controller();
    }
  };

  public on = (
    type:
      | Event.ZOOM
      | Event.ROTATION
      | Event.WAYPOINT_CLICKED
      | Event.CHANGE_FLOOR,
    handler: (any) => void
  ): void => {
    if (this._tour) {
      return this._tour.on(type, handler);
    }
  };

  public setEnableControls = (isEnabled: boolean): void => {
    if (this._tour) {
      this._tour.setEnableControls(isEnabled);
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
