import * as THREE from 'three';
import { MAX_FOV } from '../controllers/TourController';

const SPHERE_RADIUS = 1.0;

export default class Camera {
  private _position: THREE.Vector3;
  private _camera: THREE.PerspectiveCamera;
  private _target: THREE.Vector3;
  private _fov: number;
  private _phi: number;
  private _theta: number;
  private _needsRender: boolean;

  constructor(aspect: number) {
    this._fov = 90;
    this._position = new THREE.Vector3(0, 0, 0);
    this._camera = new THREE.PerspectiveCamera(this._fov, aspect, 0.01, 1000);
    this._target = new THREE.Vector3(0, 0, 0);
    this._phi = 0;
    this._theta = 0;
    this._needsRender = true;
  }

  public camera = (): THREE.PerspectiveCamera => {
    return this._camera;
  };

  public resize = (width: number, height: number): void => {
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  };

  public position = (): THREE.Vector3 => {
    return this._position.clone();
  };
  public setPosition = (position: THREE.Vector3): void => {
    this._position = position.clone();
    this._camera.position.copy(this._position);
    this.setTarget(this._phi, this._theta);
  };

  public getFov = (): number => {
    return this._fov;
  };

  public needsRender = (): boolean => {
    return this._needsRender;
  };

  public didRender = (): void => {
    this._needsRender = false;
  };

  public setTarget = (phi: number, theta: number): void => {
    if (this._phi !== phi || this._theta !== theta) {
      this._theta = theta;
      this._phi = phi;
      const x: number = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y: number = SPHERE_RADIUS * Math.cos(phi);
      const z: number = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);

      this._target = new THREE.Vector3(x, y, z);
      this._camera.lookAt(this._target.clone().add(this._position));
      this._camera.updateMatrixWorld(true);
      this._camera.updateMatrix();
      this._needsRender = true;
    }
  };

  public setFov = (fov: number): void => {
    this._camera.fov = fov;
    this._camera.updateProjectionMatrix();
  };

  public target = (): THREE.Vector3 => {
    return this._target.clone();
  };

  public theta = (): number => {
    return this._theta;
  };

  public phi = (): number => {
    return this._phi;
  };

  public addTheta = (theta: number): void => {
    this.setTarget(this._phi, this._theta + theta);
  };
}
