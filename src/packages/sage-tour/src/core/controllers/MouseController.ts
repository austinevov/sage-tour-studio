import * as THREE from 'three';
import { RotationHandler, ZoomHandler } from '../types/index';
import { IS_REPLICATED } from '../SageTour';

function positionFromEvent(event: any): { clientX: number; clientY: number } {
  let { clientX, clientY } = event;

  if (event.touches && event.touches[0]) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  }

  return { clientX, clientY };
}

export default class MouseController {
  private _mousePosition: THREE.Vector2;

  private _isInteracting: boolean;

  private _rotateStart: THREE.Vector2;
  private _rotateEnd: THREE.Vector2;
  private _rotateDelta: THREE.Vector2;
  private _rotationSpeed: number;

  private _onRotation: RotationHandler;
  private _onZoom: ZoomHandler;

  private _deltaTheta: number;
  private _deltaPhi: number;

  private _canvas: HTMLCanvasElement;

  constructor(
    canvas: HTMLCanvasElement,
    onRotation: RotationHandler,
    onZoom: ZoomHandler
  ) {
    this._mousePosition = new THREE.Vector2(0, 0);
    this._rotateStart = new THREE.Vector2(0, 0);
    this._rotateEnd = new THREE.Vector2(0, 0);
    this._rotateDelta = new THREE.Vector2(0, 0);
    this._rotationSpeed = 0.5;
    this._canvas = canvas;
    this._onRotation = onRotation;
    this._onZoom = onZoom;
    this._deltaPhi = 0;
    this._deltaTheta = 0;

    this.acquireListeners();
  }

  private onCursorStart = (event: any): void => {
    this._isInteracting = true;

    let { clientX, clientY } = positionFromEvent(event);
    const rect: DOMRect = this._canvas.getBoundingClientRect() as DOMRect;
    clientX -= rect.left;
    clientY -= rect.top;

    this._rotateStart.set(clientX, clientY);
  };

  private onCursorMove = (event: any): void => {
    let { clientX, clientY } = positionFromEvent(event);
    const rect: DOMRect = this._canvas.getBoundingClientRect() as DOMRect;
    clientX -= rect.left;
    clientY -= rect.top;

    const mx = (clientX / this._canvas.clientWidth) * 2 - 1;
    const my = -(clientY / this._canvas.clientHeight) * 2 + 1;

    this._mousePosition.set(mx, my);

    if (this._isInteracting) {
      const rotationSpeed = !IS_REPLICATED ? 0.4 : 0.25;

      this._rotateEnd.set(clientX, clientY);
      const delta = new THREE.Vector2().subVectors(
        this._rotateEnd,
        this._rotateStart
      );

      if (!IS_REPLICATED) {
        this._rotateDelta = this._rotateDelta.add(delta);
      } else {
        this._rotateDelta.copy(delta);
      }

      this._rotateStart.copy(this._rotateEnd);
    }
  };

  public update = (dt: number): void => {
    const deltaTheta =
      (Math.PI * this._rotateDelta.x) / this._canvas.clientWidth;
    const deltaPhi =
      (Math.PI * this._rotateDelta.y) / this._canvas.clientHeight;

    if (Math.abs(deltaTheta) > 0.001 || Math.abs(deltaPhi) > 0.001) {
      this._onRotation(deltaPhi, deltaTheta);
    }

    if (!IS_REPLICATED) {
      this._rotateDelta.x *= this._isInteracting ? 0.5 : 0.85;
      this._rotateDelta.y *= this._isInteracting ? 0.5 : 0.85;
    } else {
      this._rotateDelta.x = 0;
      this._rotateDelta.y = 0;
    }
  };

  private onCursorUp = (event: any) => {
    this._isInteracting = false;
  };

  private onMouseWheel = (event: MouseWheelEvent): void => {
    const deltaFOV = event.deltaY * 0.05;

    this._onZoom(deltaFOV);
  };

  public acquireListeners = (): void => {
    this._canvas.addEventListener('mousedown', this.onCursorStart, false);
    this._canvas.addEventListener('mousemove', this.onCursorMove, false);
    this._canvas.addEventListener('mouseup', this.onCursorUp, false);
    this._canvas.addEventListener('mouseout', this.onCursorUp, false);

    this._canvas.addEventListener('wheel', this.onMouseWheel, false);

    this._canvas.addEventListener('touchstart', this.onCursorStart, false);
    this._canvas.addEventListener('touchmove', this.onCursorMove, false);
    this._canvas.addEventListener('touchend', this.onCursorUp, false);
  };

  public releaseListeners = (): void => {
    this._canvas.removeEventListener('mousedown', this.onCursorStart, false);
    this._canvas.removeEventListener('mousemove', this.onCursorMove, false);
    this._canvas.removeEventListener('mouseup', this.onCursorUp, false);
    this._canvas.removeEventListener('mouseout', this.onCursorUp, false);

    this._canvas.removeEventListener('wheel', this.onMouseWheel, false);

    this._canvas.removeEventListener('touchstart', this.onCursorStart, false);
    this._canvas.removeEventListener('touchmove', this.onCursorMove, false);
    this._canvas.removeEventListener('touchend', this.onCursorUp, false);
  };

  public mousePosition = (): THREE.Vector2 => {
    return this._mousePosition.clone();
  };
}
