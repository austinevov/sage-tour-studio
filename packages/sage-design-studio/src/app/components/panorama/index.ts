import { Vector2 } from '../../types';
import Component from '../../reactor/component';
import reactor from '../../reactor';
import { LINK_TOOL, ERASER_TOOL, TUNE_TOOL } from '../../constants/tools';

export default class Panorama extends Component {
  private _id: number;
  private _label: string;
  private _edges: Panorama[];
  private _floorplanPosition: Vector2;
  private _floorplanSprite: SVGCircleElement;
  private _floor: number;
  private _thetaOffset: number;
  private _onMouseDownListener: () => void;

  public isOverFloorplan: boolean;

  constructor(id: number, name?: string, floor: number = 0) {
    super(null, 'ev-panorama');

    this._thetaOffset = 0;
    this._id = id;
    this._label = name;
    this._edges = [];
    this.isOverFloorplan = false;
    this._floorplanPosition = { x: 0, y: 0 };
    this._floor = floor;
    this._floorplanSprite = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    this._floorplanSprite.setAttribute('cx', '0px');
    this._floorplanSprite.setAttribute('cy', '50px');
    this._floorplanSprite.setAttribute('r', '15px');
    this._floorplanSprite.setAttribute('fill', '#00ff00');

    this._parent.onmousedown = this.startDrag;
    this._parent.oncontextmenu = (evt: MouseEvent) => {
      evt.preventDefault();

      return false;
    };
    this._floorplanSprite.onmousedown = (evt: MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (reactor.tool() === LINK_TOOL && evt.button === 0) {
        reactor.startLink(this);
      } else if (reactor.tool() === ERASER_TOOL && evt.button === 0) {
        reactor.removePanoramaFromFloorplan(this);
      } else if (reactor.tool() === TUNE_TOOL && evt.button === 0) {
        reactor.startTuning(this);
      } else {
        this.startDrag(evt);
      }
    };
    this._floorplanSprite.oncontextmenu = (evt: MouseEvent) => {
      evt.preventDefault();

      return false;
    };
    this._floorplanSprite.onmouseover = () => {
      if (reactor.isLinking()) {
        reactor.linkTo(this);
      }
    };
    this._floorplanSprite.onmouseout = () => {
      reactor.endLinkTo(this);
    };
    this._parent.draggable = false;

    const nameInput = document.createElement('input');
    nameInput.onmousedown = evt => {
      nameInput.select();
      evt.stopPropagation();
    };
    nameInput.oninput = (evt: any) => {
      this._label = evt.target.value;
      nameInput.value = this._label;
    };
    nameInput.value = this._label;
    this._parent.appendChild(nameInput);
  }

  public setPositionFromMouse = (mouse: Vector2): void => {
    this._parent.style.left = `${mouse.x - 275 / 2}px`;
    this._parent.style.top = `${mouse.y - 75 / 2}px`;
  };

  public setPositionFromFloorplan = (
    floorplanRelative: Vector2,
    floor: number
  ): void => {
    this._floorplanSprite.setAttribute('cx', `${floorplanRelative.x}px`);
    this._floorplanSprite.setAttribute('cy', `${floorplanRelative.y}px`);
    this._floor = floor;

    this._floorplanPosition = floorplanRelative;
  };

  public applyDeltaTheta = (delta: number): void => {
    this._thetaOffset -= delta;
  };

  public startDrag = (evt: MouseEvent): void => {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.button === 2) {
      reactor.focusPanorama(this);
    } else if (evt.button === 0) {
      this._parent.style.position = 'absolute';
      this._parent.style.transition = 'none';
      this._parent.style.zIndex = '100000';
      this._parent.style.pointerEvents = 'none';

      const { clientX, clientY } = evt;
      this.setPositionFromMouse({ x: clientX, y: clientY });

      reactor.startDrag(this);
    }
  };

  public stopDrag = (): void => {
    this._parent.removeAttribute('style');
  };

  public id = (): number => {
    return this._id;
  };

  public key = (): number => {
    return this.id();
  };

  public floor = (): number => {
    return this._floor;
  };
  public html = (): HTMLElement => {
    return this._parent;
  };

  public sprite = (): SVGElement => {
    return this._floorplanSprite;
  };

  public floorplanPosition = (): Vector2 => {
    return this._floorplanPosition;
  };

  public react = (stimulus: any): void => {};

  public name = (): string => {
    return this._label;
  };

  public addEdge = (edge: Panorama) => {
    if (this._edges.indexOf(edge) < 0) {
      this._edges.push(edge);
    }
  };

  public removeEdge = (edge: Panorama): void => {
    this._edges = this._edges.filter(panorama => panorama.id() !== edge.id());
  };

  public edges = (): Panorama[] => {
    return this._edges;
  };

  public thetaOffset = (): number => {
    return this._thetaOffset;
  };
}
