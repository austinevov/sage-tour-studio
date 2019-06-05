import * as THREE from 'three';

import { PanoramaGraphNode } from '../types/index';
import PanoramaManager from './PanoramaManager';
import { LOAD } from '../../constants/events';
import Camera from '../camera/Camera';
import Panorama from './Panorama';
import Waypoint from './Waypoint';
import MousePicker from '../controllers/MousePicker';
import Spinner from '../Spinner';

export default class Scene {
  private _panoramaManager: PanoramaManager;
  private _camera: Camera;
  private _scene: THREE.Scene;
  private _waypoints: Waypoint[];
  private _mesh: THREE.Mesh;
  private _anisotropy: number;
  private _isShowingHD: boolean;
  private _spinner: Spinner;
  private _forceLQ: boolean;

  constructor(
    panoramaGraph: PanoramaGraphNode[],
    root: number,
    imagePathRoot: string,
    canvas: HTMLCanvasElement,
    anisotropy: number,
    spinner: Spinner,
    forceLQ: boolean
  ) {
    this._forceLQ = forceLQ;
    this._scene = new THREE.Scene();
    this._camera = new Camera(canvas.clientWidth / canvas.clientHeight);
    this._anisotropy = anisotropy;
    this._spinner = spinner;
    this._panoramaManager = new PanoramaManager(
      panoramaGraph,
      root,
      imagePathRoot,
      anisotropy
    );

    this._isShowingHD = false;
    this._waypoints = [];
  }

  public hotReload = (
    panoramaGraph: PanoramaGraphNode[],
    root: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      document.addEventListener(LOAD, () => {
        resolve();
      });

      const imagePathRoot: string = this._panoramaManager.imagePathRoot();

      this._panoramaManager = new PanoramaManager(
        panoramaGraph,
        root,
        imagePathRoot,
        this._anisotropy
      );
    });
  };

  public initialize = (): void => {
    this._waypoints = this._waypoints.map(waypoint => {
      waypoint.markForDeletion();
      return waypoint;
    });
    while (this._scene.children.length > 0) {
      this._scene.remove(this._scene.children[0]);
    }

    this._waypoints = this._panoramaManager
      .panoramas()
      .map((panorama: Panorama) => {
        return new Waypoint(panorama, this);
      });

    const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide
    });
    this._mesh = new THREE.Mesh(geometry, material);

    this._mesh.visible = false;

    this._scene.add(this._mesh);
  };

  public resize = (width: number, height: number): void => {
    this._camera.resize(width, height);
  };

  public update = (dt: number, picker: MousePicker): void => {
    this._waypoints.forEach(waypoint => {
      waypoint.update(dt, picker.picker(), this._camera);
    });

    this._mesh.position.copy(this._camera.camera().position);
  };

  public scene = (): THREE.Scene => {
    return this._scene;
  };

  public camera = (): Camera => {
    return this._camera;
  };

  public panoramaManager = (): PanoramaManager => {
    return this._panoramaManager;
  };

  public getWaypoints = (): Waypoint[] => {
    return this._waypoints;
  };

  public updatePanoramaPosition = (
    id: number,
    position: THREE.Vector3
  ): void => {
    const waypoint = this._waypoints.filter(waypoint => {
      return waypoint.id() === id;
    })[0];
    waypoint.updatePosition(position);
  };

  public setVisibilityForPanorama = (panorama: Panorama): void => {
    this._waypoints.forEach(waypoint => {
      waypoint.setVisible(false);

      if (panorama.edgeIds().indexOf(waypoint.id()) >= 0) {
        waypoint.setVisible(true);
      }
    });
  };

  public activate = (panoramaId: number): void => {
    this._panoramaManager.activate(panoramaId, this._camera);
    this.setVisibilityForPanorama(this._panoramaManager.activePanorama());
  };

  public showHDTexture = (
    renderer: THREE.WebGLRenderer,
    hdTexture: WebGLTexture
  ): void => {
    if (!this._forceLQ) {
      const texture = new THREE.Texture();
      renderer.setTexture2D(texture, 0);
      const texProps = renderer.properties.get(texture);
      texProps.__webglTexture = hdTexture;

      (this._mesh.material as any).map = texture;
      this._mesh.visible = true;
      this._isShowingHD = true;
    }
  };

  public hideHDTexture = (): void => {
    this._mesh.visible = false;
    this._isShowingHD = false;
  };

  public isShowingHD = (): boolean => {
    return this._isShowingHD;
  };
}
