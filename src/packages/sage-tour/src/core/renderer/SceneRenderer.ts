import * as THREE from 'three';

import PanoramaManager from '../scene/PanoramaManager';
import Panorama from '../scene/Panorama';
import Scene from '../scene/index';
import PanoramaRenderer from './PanoramaRenderer';
import TransitionRenderer from './TransitionRenderer';
import Camera from '../camera/Camera';
import { TransitionEvent } from '../types/index';
import { TRANSITION } from '../../constants/events';
import LabelContainer from '../labels/LabelContainer';
import LabelRenderer from '../labels/LabelRenderer';
import { HIDE_UI, FORCE_LD, THETA_OFFSET, QUALITY } from '../SageTourInternal';
export default class SceneRenderer {
  private _renderer: THREE.WebGLRenderer;
  private _panoramaRenderer: PanoramaRenderer;
  private _transitionRenderer: TransitionRenderer;
  private _canvas: HTMLCanvasElement;
  private _labelRenderer: LabelRenderer;
  private _mesh: THREE.Mesh;
  private _labelRenderCount: number;

  private _isHDBuffered: boolean;
  private _bufferCount: number;
  private _hdTexture: WebGLTexture;
  private _isBufferInProgress: boolean;
  private _forceRender: boolean;
  private _gl: WebGLRenderingContext;

  private _workCanvas: HTMLCanvasElement;
  private _workContext: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, labelContainer: LabelContainer) {
    this._canvas = canvas;
    this._labelRenderer = new LabelRenderer(labelContainer);
    this._isHDBuffered = false;
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true
    });
    this._labelRenderCount = 0;
    this._renderer.autoClear = true;
    this._renderer.autoClearColor = false;
    this._renderer.autoClearDepth = true;
    this._renderer.autoClearStencil = true;
    this._gl = this._renderer.getContext();
    this._panoramaRenderer = new PanoramaRenderer(this.context(), this._canvas);
    this._transitionRenderer = new TransitionRenderer(
      this.context(),
      this._canvas
    );
    if (!FORCE_LD) {
      this._hdTexture = this.createHDTexture();
    }
    this._bufferCount = 0;
    this._isBufferInProgress = false;
    this._forceRender = true;
    document.addEventListener(TRANSITION, (event: TransitionEvent) => {
      const { start, finish, camera } = event.detail;

      this.transitionTo(finish, start, camera);
    });

    this._workCanvas = document.getElementById(
      'texture-splitter'
    ) as HTMLCanvasElement;
    this._workContext = this._workCanvas.getContext('2d');
  }

  private createHDTexture = (): WebGLTexture => {
    const gl = this._gl;
    gl.activeTexture(gl.TEXTURE0);
    const texture: WebGLTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 8192;
    const height = 4096;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      undefined
    );

    const ext =
      gl.getExtension('EXT_texture_filter_anisotropic') ||
      gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
      gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    if (ext) {
      const max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
    }

    return texture;
  };

  private clearCanvas = (): void => {
    this._workContext.fillRect(0, 0, 512, 512);
  };
  private writeToCanvasBufferToGPU = (
    hd: HTMLImageElement,
    x: number,
    y: number
  ): void => {
    this._workContext.drawImage(hd, x, y, 512, 512, 0, 0, 512, 512);

    const gl = this._gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._hdTexture);

    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      x,
      4096 - y - 512,
      512,
      512,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(this._workContext.getImageData(0, 0, 512, 512).data.buffer)
    );
    this._isBufferInProgress = false;
  };

  private bufferHDTexture = (hd: HTMLImageElement): void => {
    const count = this._bufferCount;
    if (!this._isBufferInProgress) {
      this._isBufferInProgress = true;

      const x = (count % 16) * 512;
      const y = Math.floor(count / 16) * 512;

      this.writeToCanvasBufferToGPU(hd, x, y);
      this._bufferCount++;
    }
  };

  public resize = (width: number, height: number) => {
    let scale = 1;
    if (QUALITY === 'normal') {
      scale = 1.4;
    } else if (QUALITY === 'best') {
      scale = 2;
    }
    this._renderer.setSize(width * scale, height * scale);

    this._renderer.domElement.style.width = `${width}px`;
    this._renderer.domElement.style.height = `${height}px`;
    this._renderer.domElement.width = width * scale;
    this._renderer.domElement.height = height * scale;
  };

  public getAnisotropy = (): number => {
    return this._renderer.getMaxAnisotropy();
  };

  public context = (): WebGLRenderingContext => {
    return this._renderer.getContext();
  };

  public update = (dt: number) => {
    if (this._transitionRenderer.isTransitioning()) {
      this._transitionRenderer.update(dt);
    }
  };

  public render = (scene: Scene): void => {
    if (this._transitionRenderer.isTransitioning()) {
      this._labelRenderer.hideAll();
      this._transitionRenderer.render(scene.camera());
      scene.hideHDTexture();
      this._isHDBuffered = false;
      this._isBufferInProgress = false;
      this._bufferCount = 0;
    } else {
      const isHDLoaded = scene
        .panoramaManager()
        .activePanorama()
        .isHDLoaded();

      this._panoramaRenderer.render(
        scene.camera(),
        scene.panoramaManager().activePanorama()
      );
      if (!this._isHDBuffered) {
        scene.hideHDTexture();
        if (isHDLoaded) {
          this._forceRender = false;
          this.bufferHDTexture(
            scene
              .panoramaManager()
              .activePanorama()
              .getHDTexture()
          );
          this._isHDBuffered = this._bufferCount === 128;
        }
      } else {
        const gl = this._gl;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        scene.showHDTexture(this._renderer, this._hdTexture);
        this.clearCanvas();
      }

      scene.camera().addTheta(THETA_OFFSET);
      this._renderer.render(scene.scene(), scene.camera().camera());
      scene.camera().addTheta(-THETA_OFFSET);

      if (
        !HIDE_UI &&
        (scene.camera().needsRender() || this._labelRenderCount === 0)
      ) {
        scene.camera().didRender();
        this._labelRenderer.render(scene);
      }

      this._labelRenderCount++;
      this._labelRenderCount = this._labelRenderCount % 50;
    }
  };

  public transitionTo = (
    destination: Panorama,
    source: Panorama,
    camera: Camera
  ): void => {
    this._transitionRenderer.makeTransition(
      source,
      destination,
      camera.theta(),
      camera.phi()
    );
  };
}
