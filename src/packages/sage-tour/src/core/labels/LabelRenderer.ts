import * as THREE from 'three';
import LabelContainer from './LabelContainer';
import Scene from '../scene';
import Waypoint from '../scene/Waypoint';
import Label from './Label';
import { HIDE_UI, THETA_OFFSET } from '../SageTourInternal';

export default class LabelRenderer {
  private labelContainer: LabelContainer;
  private hidden: boolean;

  constructor(labelContainer: LabelContainer) {
    this.labelContainer = labelContainer;
    this.hidden = false;
  }

  public hideAll = (): void => {
    if (!this.hidden) {
      if (!HIDE_UI) {
        this.labelContainer.hideAll();
      }
      this.hidden = true;
    }
  };

  public render = (scene: Scene): void => {
    this.hidden = false;
    const fov: number = scene.camera().getFov();
    scene.camera().addTheta(THETA_OFFSET);
    const camera: THREE.PerspectiveCamera = scene.camera().camera();
    const [width, height] = this.labelContainer.dimensions();
    scene.getWaypoints().forEach(waypoint => {
      const label: Label = this.labelContainer.labelById(waypoint.id());
      if (waypoint.isVisible()) {
        let position: THREE.Vector3 = waypoint.getMeshWorldPosition();
        const widthHalf = width / 2;
        const heightHalf = height / 2;
        const labelPosition = new THREE.Vector3()
          .copy(position)
          .sub(new THREE.Vector3(0, 15, 0));
        const cameraDirection = new THREE.Vector3();
        const cameraPosition = new THREE.Vector3();
        camera.getWorldPosition(cameraPosition);
        camera.getWorldDirection(cameraDirection);
        const waypointDirection = new THREE.Vector3()
          .copy(position)
          .sub(cameraPosition)
          .normalize();
        const angle = THREE.Math.radToDeg(
          waypointDirection.angleTo(cameraDirection)
        );
        const distance = cameraPosition.distanceTo(position);
        if (angle < fov) {
          position = labelPosition.project(camera);
          position.x = position.x * widthHalf + widthHalf;
          position.y = -(position.y * heightHalf) + heightHalf;
          const { x, y } = position;
          label.setPosition(x, y);
          label.setText(waypoint.getLabel().replace('_', ' '));
          label.setFontSizeFromDistance(distance);
          label.toggleVisibility(true);
        } else {
          label.toggleVisibility(false);
        }
      } else {
        label.toggleVisibility(false);
      }
    });

    scene.camera().addTheta(-THETA_OFFSET);
  };
}
