import * as THREE from 'three';
import Label from './Label';

export default class LabelContainer {
  private _container: HTMLDivElement;
  private _labels: { [id: number]: Label };
  private _hoveredId: number;

  constructor(parent: HTMLDivElement, panoramaIds: number[]) {
    this._container = document.createElement('div');
    this._container.className = 'ev-label-container';
    parent.appendChild(this._container);
    this._labels = {};
    panoramaIds.forEach(id => {
      this._labels[id] = new Label(parent);
    });
  }

  public labelById = (id: number): Label => {
    return this._labels[id];
  };

  public dimensions = (): number[] => {
    return [this._container.clientWidth, this._container.clientHeight];
  };

  public hideAll = (): void => {
    Object.keys(this._labels).forEach(key => {
      this._labels[Number(key)].toggleVisibility(false);
    });
  };

  public onLabelHover = (evt: CustomEvent) => {
    const id: number = evt.detail.id;
    const camera: THREE.PerspectiveCamera = evt.detail.camera;
    const mesh: THREE.Mesh = evt.detail.mesh;
    const label: string = evt.detail.label;
    const widthHalf = this._container.clientWidth / 2;
    const heightHalf = this._container.clientHeight / 2;
    let position: THREE.Vector3 = new THREE.Vector3();
    mesh.getWorldPosition(position);
    position = position.project(camera);
    position.x = position.x * widthHalf + widthHalf;
    position.y = -(position.y * heightHalf) + heightHalf;
    const { x, y } = position;
  };

  public endLabelHover = (evt: CustomEvent) => {
    const { id } = evt.detail;
    if (Number(id) === Number(this._hoveredId)) {
      this._hoveredId = undefined;
    }
  };

  public animate = (): void => {
    requestAnimationFrame(this.animate);
  };
}
