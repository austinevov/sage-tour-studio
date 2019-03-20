import SageTour, { SageTourInternal } from '../../../../packages/sage-tour';
import reactor from '../../reactor';
import Component from '../../reactor/component';
import Panorama from '../panorama';
import { Vector2 } from '../../types';
import rotate2 from '../../utils/rotate2';
import RotationInput from './rotation-input';

// const panoramaGraph = (() => {
//   return getPanoramas().map(panorama => {
//     return {
//       id: panorama.id(),
//       position: panorama.floorplanPosition(),
//       edges: [],
//       name: panorama.name(),
//       floor: 1
//     };
//   });
// })();

const onLoad = () => {};

export default class TourPreview extends Component {
  private _container: HTMLDivElement;
  private _tour: any;
  private _rotationInput: RotationInput;
  private _rotation: number;
  private _initialized: boolean;

  constructor(root: HTMLDivElement) {
    super(root, 'ev-tour-preview');

    this._initialized = false;
    this._container = document.createElement('div');
    this._parent.appendChild(this._container);
    this._container.className = 'ev-tour-preview-container';

    this._rotationInput = new RotationInput(this._parent);
    this._rotation = 0;
    reactor.setTourPreview(this);

    // setTimeout(() => {
    //   const pgraph = panoramaGraph.map(panorama => {
    //     panorama.edges = [];
    //     return panorama;
    //   });

    //   this._tour.hotReload(pgraph);
    // }, 5000);
  }

  public initialize = (token: string, panoramas: Panorama[]): void => {
    const panoramaGraph = panoramas.map(panorama => {
      return {
        id: panorama.id(),
        position: panorama.floorplanPosition(),
        edges: [],
        name: panorama.name(),
        floor: panorama.floor()
      };
    });

    const opts = {
      imagePathRoot: `https://s3.amazonaws.com/assets.sagetourstudio/${token}`,
      disableControls: false
    };

    this._tour = new SageTourInternal(
      this._container,
      panoramaGraph,
      onLoad,
      opts
    );
    this._tour.setEnableControls(true);
    this._tour.on('rotation', ({ deltaPhi, deltaTheta }) =>
      reactor.handleRotation(deltaPhi, deltaTheta)
    );

    this._initialized = true;
  };

  public updatePosition = (panorama: Panorama, position: Vector2): void => {
    if (this._initialized) {
      const rotatedPosition: Vector2 = rotate2(position, this._rotation);

      this._tour.updatePanoramaPosition(panorama.id(), {
        x: rotatedPosition.x,
        y: panorama.floor(),
        z: rotatedPosition.y
      });
    }
  };

  public setRotation = (rotation: number): void => {
    this._rotation = rotation;
  };

  public updateThetaOffset = (panorama: Panorama, theta: number): void => {
    if (this._initialized) {
      this._tour.updatePanoramaThetaOffset(panorama.id(), theta);
    }
  };

  public addEdge = (start: Panorama, end: Panorama): void => {
    if (this._initialized) {
      this._tour.addPanoramaEdge(start.id(), end.id());
    }
  };

  public removeEdge = (start: Panorama, end: Panorama): void => {
    if (this._initialized) {
      this._tour.removePanoramaEdge(start.id(), end.id());
    }
  };

  public lockPhi = (): void => {
    if (this._initialized) {
      this._tour.setLock(true);
    }
  };

  public unlockPhi = (): void => {
    if (this._initialized) {
      this._tour.setLock(false);
    }
  };

  public react = (stimulus: any): void => {
    if (this._initialized) {
      const { active } = stimulus;

      this._tour.changePanorama(active.id());
    }
  };
}
