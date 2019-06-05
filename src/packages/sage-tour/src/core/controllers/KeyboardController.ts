import * as THREE from 'three';
import { RotationHandler, ZoomHandler } from '../types/index';

const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_TOP = 38;
const KEY_BOTTOM = 40;

export default class KeyboardController {
  private _onRotation: RotationHandler;
  private _onZoom: ZoomHandler;
  private _canvas: HTMLCanvasElement;

  private _rotationSpeed: number;

  private _keyBindings: { [keyCode: number]: { state: boolean } };

  private _start: number;

  constructor(
    canvas: HTMLCanvasElement,
    onRotation: RotationHandler,
    onZoom: ZoomHandler
  ) {
    this._rotationSpeed = 0.05;
    this._canvas = canvas;
    this._onRotation = onRotation;
    this._onZoom = onZoom;
    this._keyBindings = {};
    [
      KEY_W,
      KEY_D,
      KEY_A,
      KEY_S,
      KEY_LEFT,
      KEY_RIGHT,
      KEY_TOP,
      KEY_BOTTOM
    ].forEach(code => {
      this.bindKeyListener(code);
    });
    this.acquireListeners();
    this.update();
  }

  public bindKeyListener = (key: number): void => {
    this._keyBindings[key] = { state: false };
  };

  private handleKeyDown = (evt: KeyboardEvent): void => {
    const binding = this._keyBindings[evt.keyCode];
    if (binding) {
      binding.state = true;
    }
  };

  private handleKeyUp = (evt: KeyboardEvent): void => {
    const binding = this._keyBindings[evt.keyCode];
    if (binding) {
      binding.state = false;
    }
  };

  public acquireListeners = (): void => {
    window.addEventListener('keydown', this.handleKeyDown, false);
    window.addEventListener('keyup', this.handleKeyUp, false);
    this._canvas.oncontextmenu = evt => {
      evt.preventDefault();
    };
  };

  public update = (): void => {
    if (this._keyBindings[KEY_LEFT].state || this._keyBindings[KEY_A].state) {
      this._onRotation(0, 1 * this._rotationSpeed);
    }

    if (this._keyBindings[KEY_RIGHT].state || this._keyBindings[KEY_D].state) {
      this._onRotation(0, -1 * this._rotationSpeed);
    }

    if (this._keyBindings[KEY_BOTTOM].state || this._keyBindings[KEY_S].state) {
      this._onRotation(-1 * this._rotationSpeed, 0);
    }

    if (this._keyBindings[KEY_TOP].state || this._keyBindings[KEY_W].state) {
      this._onRotation(1 * this._rotationSpeed, 0);
    }

    requestAnimationFrame(this.update);
  };
}
