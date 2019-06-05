import * as THREE from 'three';

import Camera from '../camera/Camera';
import Scene from '../scene/index';
import Panorama from '../scene/Panorama';
import { TransitionEvent, FloorData } from '../types/index';
import { TRANSITION } from '../../constants/events';
import clamp from '../../utils/clamp';
import Minimap from '../Minimap';
import DisplayBar from '../DisplayBar';
import { THETA_OFFSET, updateThetaOffset } from '../SageTourInternal';

export const MIN_FOV = 10;
export const MAX_FOV = 150;

export default class TourController {
  private _phi: number;
  private _theta: number;
  private _fov: number;
  private _isFovDirty: boolean;
  private _isPanoramaDirty: boolean;
  private _targetPanoramaId: number;
  private _minimap: Minimap;
  private _displayBar: DisplayBar;
  private _floorData: FloorData;

  constructor() {
    this._phi = Math.PI / 2;
    this._theta = 0;
    this._fov = 90;
    this._isFovDirty = false;
    this._isPanoramaDirty = false;
    this._targetPanoramaId = 0;
  }

  public applyDeltaPhi = (deltaPhi: number): void => {
    this.setPhi(this._phi - deltaPhi);
  };

  public applyDeltaTheta = (deltaTheta: number): void => {
    this.setTheta(this._theta - deltaTheta);
  };

  public applyDeltaFOV = (deltaFOV: number): void => {
    this.setFOV(this._fov + deltaFOV);
  };

  public setPhi = (phi: number): void => {
    this._phi = clamp(phi, 0.1, Math.PI - 0.1);
  };

  public setMinimap = (minimap: Minimap): void => {
    this._minimap = minimap;
  };

  public setDisplayBar = (displayBar: DisplayBar): void => {
    this._displayBar = displayBar;
  };

  public setTheta = (theta: number): void => {
    this._theta = theta;

    if (this._minimap) {
      this._minimap.updateDirectionIndicator(this.theta(), this.fov());
    }
  };

  public setFloorData = (floorData: FloorData): void => {
    this._floorData = floorData;
  };

  public setFOV = (fov: number): void => {
    this._fov = clamp(fov, MIN_FOV, MAX_FOV);
    this._isFovDirty = true;

    if (this._minimap) {
      this._minimap.updateDirectionIndicator(this.theta(), this.fov());
    }
  };

  public theta = (): number => {
    return this._theta;
  };

  public phi = (): number => {
    return this._phi;
  };

  public fov = (): number => {
    return this._fov;
  };

  public changePanorama = (
    destination: Panorama,
    source: Panorama = undefined,
    transition: boolean = false,
    camera: Camera = undefined
  ): void => {
    if (transition) {
      const event: TransitionEvent = new CustomEvent(TRANSITION, {
        detail: {
          start: source,
          finish: destination,
          camera
        }
      });

      document.dispatchEvent(event);
    }

    this._isPanoramaDirty = true;
    this._targetPanoramaId = destination.id();

    if (this._minimap) {
      this._minimap.setPanorama(destination);
      this._minimap.updateDirectionIndicator(this.theta(), this.fov());
      if (this._displayBar) {
        this._displayBar.setPanorama(destination);
      }
      if (source.floor() !== destination.floor()) {
        this._minimap.setFloor(destination.floor());
        if (this._displayBar) {
          this._displayBar.setFloor(destination.floor());
        }
      }
    }

    const floor = destination.floor();
    if (this._floorData) {
      updateThetaOffset(this._floorData.byFloor[floor].theta);
    }
  };

  private updateCamera = (camera: Camera, activePanorama: Panorama): void => {
    const offset: number = activePanorama ? activePanorama.thetaOffset() : 0;

    camera.setTarget(this._phi, this._theta + offset);

    if (this._isFovDirty) {
      camera.setFov(this._fov);
      this._isFovDirty = false;
    }
  };

  public update = (scene: Scene, activePanorama: Panorama): void => {
    if (this._isPanoramaDirty) {
      scene.activate(this._targetPanoramaId);
      this._isPanoramaDirty = false;
    }

    this.updateCamera(scene.camera(), activePanorama);
  };
}
