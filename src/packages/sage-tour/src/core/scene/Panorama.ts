import * as THREE from 'three';
import LODManager from '../lod/LODManager';

export default class Panorama {
  private _id: number;
  private _position: THREE.Vector3;
  private _floor: number;
  private _name: string;
  private _edges: Panorama[];
  private _lodManager: LODManager;
  private _thetaOffset: number;
  private _hdTexture: HTMLImageElement;
  private _isHDLoaded: boolean;

  constructor(
    id: number,
    floor: number,
    name: string,
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ) {
    this._id = id;
    this._floor = floor;
    this._name = name;
    this.setPosition(position);
    this._edges = [];
    this._thetaOffset = 0;
    this._lodManager = new LODManager(this._id);
    this._isHDLoaded = false;
  }

  public addEdge = (edge: Panorama): void => {
    this._edges.push(edge);
  };

  public setEdges = (edges: Panorama[]): void => {
    this._edges = edges;
  };

  public removeEdge = (edge: Panorama): void => {
    this._edges = this._edges.filter(panorama => panorama.id() !== edge.id());
  };

  public initializeGL = (gl: WebGLRenderingContext): void => {
    this._lodManager.initialize(gl);
  };

  public bind = (): void => {
    this._lodManager.bind();
  };

  public buffer = (): void => {
    this._lodManager.buffer();
  };
  public update = (): void => {
    this._lodManager.update();
  };
  public preload = (imagePathRoot: string): Promise<any> => {
    return this._lodManager.preload(imagePathRoot);
  };

  public load = (imagePathRoot: string): Promise<any> => {
    return this._lodManager.load(imagePathRoot);
  };

  public loadHD = (imagePathRoot: string, anisotropy: number): void => {
    if (!this._isHDLoaded) {
      const path = `${imagePathRoot}/panorama_source/${this._id}.jpeg`;
      this._hdTexture = new Image();
      this._hdTexture.crossOrigin = 'anonymous';
      this._hdTexture.onload = () => {
        this._isHDLoaded = true;
      };
      this._hdTexture.src = path;
      // this._hdTexture = new THREE.TextureLoader().load(path, texture => {
      //   this._hdTexture = texture;
      //   this._hdTexture.anisotropy = anisotropy;
      //   this._hdTexture.minFilter = THREE.LinearFilter;
      //   this._hdTexture.magFilter = THREE.LinearMipMapLinearFilter;
      //   (this._hdTexture as any).thePath = path;

      //   this._isHDLoaded = true;
      // });
    }
  };

  public getHDTexture = (): HTMLImageElement => {
    return this._hdTexture;
  };

  public isHDLoaded = (): boolean => {
    return this._isHDLoaded;
  };

  public loadNeighbors = (imagePathRoot: string): void => {
    this._edges.forEach(neighbor => {
      neighbor.load(imagePathRoot);
    });
  };

  public isNeighbor = (candidate: Panorama): boolean => {
    return this.edgeIds().indexOf(candidate._id) >= 0;
  };

  public edgeIds = (): number[] => {
    return this._edges.map((edge: Panorama) => {
      return edge._id;
    });
  };

  public edges = (): Panorama[] => {
    return this._edges;
  };

  public id = (): number => {
    return this._id;
  };

  public position = (): THREE.Vector3 => {
    return this._position.clone();
  };

  public floor = (): number => {
    return this._floor;
  };

  public name = (): string => {
    return this._name;
  };

  public getBestTexture = (): number => {
    return this._lodManager.getBestTexture();
  };
  public setPosition = (position: THREE.Vector3): void => {
    this._position = position.clone();
    this._position.y = this.floor() * 100;
  };

  public setThetaOffset = (offset: number): void => {
    this._thetaOffset = offset;
  };

  public thetaOffset = (): number => {
    return this._thetaOffset;
  };
}
