import * as THREE from 'three';

import * as waypointIndicatorFS from '../renderer/shader/waypoint-indicator-fs.glsl';
import * as waypointIndicatorVS from '../renderer/shader/waypoint-indicator-vs.glsl';
import Scene from './index';
import Camera from '../camera/Camera';
import clamp from '../../utils/clamp';

const MIN_OPACITY = 0.4;
const MAX_OPACITY = 0.8;

export default class WaypointView {
  private name: string;
  private geometry: THREE.PlaneGeometry;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private collider: THREE.Mesh;

  private isHovering: boolean;
  private opacity: number;
  private visible: boolean;
  private id: number;
  private shaderUniforms: { [uniform: string]: any };
  private position: THREE.Vector3;
  private label: string;

  private onClicked: () => void;

  constructor(
    id: number,
    label: string,
    name: string,
    scene: Scene,
    onClicked: () => void
  ) {
    this.id = id;
    this.isHovering = false;
    this.opacity = MIN_OPACITY;
    this.name = name;
    this.label = label;
    this.visible = false;

    let color = new THREE.Vector3(128, 128, 128);
    if (id % 2 === 0) {
      //      color = new THREE.Vector3(61, 95, 126);
    }

    this.shaderUniforms = {
      u_opacity: { type: 'f', value: this.opacity },
      u_time: { type: 'f', value: 0.0 },
      u_color: new THREE.Uniform(color)
    };

    this.onClicked = onClicked;

    this.initialize(scene.scene());
  }

  public initialize = (scene: THREE.Scene): void => {
    this.geometry = new THREE.PlaneGeometry(13, 13);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.shaderUniforms,
      vertexShader: waypointIndicatorVS,
      fragmentShader: waypointIndicatorFS,
      side: THREE.DoubleSide,
      depthTest: false,
      transparent: true
    });

    this.shaderUniforms.u_opacity.value = this.opacity;

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.renderOrder = 1;
    this.mesh.name = this.name;

    const colliderMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      depthTest: false,
      opacity: 0.0,
      transparent: true
    });

    this.collider = new THREE.Mesh(
      new THREE.BoxGeometry(14, 14, 14),
      colliderMat
    );

    this.collider.name = `${this.mesh.name}-collider`;

    scene.add(this.mesh);
    scene.add(this.collider);

    document.addEventListener('mousedown', this.handleTravel);

    this.setVisible(false);
  };

  public setVisible = (visible): void => {
    this.visible = visible;
    this.mesh.visible = visible;
    this.collider.visible = visible;
  };

  public updateMeshPosition = (position: THREE.Vector3): void => {
    this.position = position.clone(); //.sub(new THREE.Vector3(0, 100, 0));
    //this.mesh.lookAt(position.clone());

    this.mesh.position.copy(this.position);
    this.collider.position.copy(this.mesh.position);
  };

  public update = (
    dt: number,
    picker: THREE.Raycaster,
    camera: Camera
  ): void => {
    // this.mesh.lookAt(
    //   this.mesh.position.clone().add(new THREE.Vector3(0, 100, 0))
    // );
    this.mesh.lookAt(camera.position());
    this.collider.lookAt(camera.position());

    const wasHovering = this.isHovering;
    this.isHovering = false;
    picker.intersectObject(this.collider).forEach(({ object }) => {
      if (object.name === this.collider.name) {
        this.isHovering = true;
      }
    });

    if (this.isHovering) {
      const event: CustomEvent = new CustomEvent('start_label_hover', {
        detail: {
          id: this.id,
          camera: camera.camera(),
          mesh: this.mesh,
          label: this.label
        }
      });

      document.dispatchEvent(event);
    }

    if (wasHovering && !this.isHovering) {
      const event: CustomEvent = new CustomEvent('end_label_hover', {
        detail: {
          id: this.id
        }
      });

      document.dispatchEvent(event);
    }

    const delta = this.isHovering ? 1 : -1;
    const opacity = this.opacity + delta * dt;

    this.opacity = clamp(opacity, MIN_OPACITY, MAX_OPACITY);
    this.shaderUniforms.u_opacity.value = this.opacity;
    this.shaderUniforms.u_time.value = performance.now() / 1000;
  };

  private handleTravel = (): void => {
    if (this.isHovering && this.visible) {
      this.onClicked();
    }
  };

  public markForDeletion = (): void => {
    // private geometry: THREE.PlaneGeometry;
    // private material: THREE.ShaderMaterial;
    // private mesh: THREE.Mesh;
    // private collider: THREE.Mesh;

    this.geometry.dispose();
    this.material.dispose();
  };

  public isVisible = (): boolean => {
    return this.visible;
  };

  public getMeshWorldPosition = (): THREE.Vector3 => {
    let position = new THREE.Vector3();
    this.mesh.getWorldPosition(position);

    return position.clone();
  };

  public getLabel = (): string => {
    return this.label;
  };
}
