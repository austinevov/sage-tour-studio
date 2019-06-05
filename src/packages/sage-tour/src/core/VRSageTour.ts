import * as THREE from 'three';
import * as WebVRPolyfill from 'webvr-polyfill';

import fetchTour, { TourData } from './fetchTour';
import { PanoramaGraphNode } from './types';

const polyfill = new WebVRPolyfill();

export interface SageTourOpts {
  imagePathRoot: string;
  rootId?: number;
  initialYawDegrees?: number;
  initialPitchDegrees?: number;
  disableControls?: boolean;
  forceLD?: boolean;
}

export default class VRSageTour {
  private _canvas: HTMLCanvasElement;
  private _renderer: THREE.WebGLRenderer;
  private _camera: THREE.PerspectiveCamera;
  private _scene: THREE.Scene;
  private _mesh: THREE.Mesh;
  private _panoramas: PanoramaGraphNode[];
  constructor(
    container: HTMLDivElement,
    token: string,
    onLoad: () => void,
    opts: SageTourOpts
  ) {
    fetchTour(token).then((data: TourData) => {
      this._panoramas = data.panoramas;
      this._canvas = document.createElement('canvas');
      this._canvas.setAttribute('class', 'sage-tour--canvas');
      this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas });
      this._renderer.setPixelRatio(window.devicePixelRatio);
      this._renderer.setSize(window.innerWidth, window.innerHeight);
      this._renderer.vr.enabled = true;
      document.body.appendChild(
        WEBVR.createButton(this._renderer, {
          frameOfReferenceType: 'head-model'
        })
      );

      this._scene = new THREE.Scene();

      const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);
      const texture: THREE.Texture = new THREE.TextureLoader().load(
        `${opts.imagePathRoot}/panorama_source/${this._panoramas[0].id}.jpeg`
      );
      const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texture
      });
      this._mesh = new THREE.Mesh(geometry, material);
      this._scene.add(this._mesh);

      this._camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this._camera.layers.enable(1);

      window.addEventListener('resize', this.onWindowResize, false);

      this.animate();
    });
  }

  onWindowResize = (): void => {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = (): void => {
    this._renderer.setAnimationLoop(this.render);
  };

  render = (): void => {
    this._renderer.render(this._scene, this._camera);
  };
}

//FROM three.js
var WEBVR = {
  createButton: function(renderer, options) {
    if (options && options.frameOfReferenceType) {
      renderer.vr.setFrameOfReferenceType(options.frameOfReferenceType);
    }

    function showEnterVR(device) {
      button.style.display = '';

      button.style.cursor = 'pointer';
      button.style.left = 'calc(50% - 50px)';
      button.style.width = '100px';

      button.textContent = 'ENTER VR';

      button.onmouseenter = function() {
        button.style.opacity = '1.0';
      };
      button.onmouseleave = function() {
        button.style.opacity = '0.5';
      };

      button.onclick = function() {
        device.isPresenting
          ? device.exitPresent()
          : device.requestPresent([{ source: renderer.domElement }]);
      };

      renderer.vr.setDevice(device);
    }

    function showEnterXR(device) {
      var currentSession = null;

      function onSessionStarted(session) {
        session.addEventListener('end', onSessionEnded);

        renderer.vr.setSession(session);
        button.textContent = 'EXIT VR';

        currentSession = session;
      }

      function onSessionEnded(event) {
        currentSession.removeEventListener('end', onSessionEnded);

        renderer.vr.setSession(null);
        button.textContent = 'ENTER VR';

        currentSession = null;
      }

      //

      button.style.display = '';

      button.style.cursor = 'pointer';
      button.style.left = 'calc(50% - 50px)';
      button.style.width = '100px';

      button.textContent = 'ENTER VR';

      button.onmouseenter = function() {
        button.style.opacity = '1.0';
      };
      button.onmouseleave = function() {
        button.style.opacity = '0.5';
      };

      button.onclick = function() {
        if (currentSession === null) {
          device
            .requestSession({
              immersive: true,
              exclusive: true /* DEPRECATED */
            })
            .then(onSessionStarted);
        } else {
          currentSession.end();
        }
      };

      renderer.vr.setDevice(device);
    }

    function showVRNotFound() {
      button.style.display = '';

      button.style.cursor = 'auto';
      button.style.left = 'calc(50% - 75px)';
      button.style.width = '150px';

      button.textContent = 'VR NOT FOUND';

      button.onmouseenter = null;
      button.onmouseleave = null;

      button.onclick = null;

      renderer.vr.setDevice(null);
    }

    function stylizeElement(element) {
      element.style.position = 'absolute';
      element.style.bottom = '20px';
      element.style.padding = '12px 6px';
      element.style.border = '1px solid #fff';
      element.style.borderRadius = '4px';
      element.style.background = 'rgba(0,0,0,0.1)';
      element.style.color = '#fff';
      element.style.font = 'normal 13px sans-serif';
      element.style.textAlign = 'center';
      element.style.opacity = '0.5';
      element.style.outline = 'none';
      element.style.zIndex = '999';
    }

    if ('xr' in navigator) {
      var button = document.createElement('button');
      button.style.display = 'none';

      stylizeElement(button);

      (navigator as any).xr
        .requestDevice()
        .then(function(device) {
          device
            .supportsSession({
              immersive: true,
              exclusive: true /* DEPRECATED */
            })
            .then(function() {
              showEnterXR(device);
            })
            .catch(showVRNotFound);
        })
        .catch(showVRNotFound);

      return button;
    } else if ('getVRDisplays' in navigator) {
      var button = document.createElement('button');
      button.style.display = 'none';

      stylizeElement(button);

      window.addEventListener(
        'vrdisplayconnect',
        function(event) {
          showEnterVR((event as any).display);
        },
        false
      );

      window.addEventListener(
        'vrdisplaydisconnect',
        function(event) {
          showVRNotFound();
        },
        false
      );

      window.addEventListener(
        'vrdisplaypresentchange',
        function(event) {
          button.textContent = (event as any).display.isPresenting
            ? 'EXIT VR'
            : 'ENTER VR';
        },
        false
      );

      window.addEventListener(
        'vrdisplayactivate',
        function(event) {
          (event as any).display.requestPresent([
            { source: renderer.domElement }
          ]);
        },
        false
      );

      navigator
        .getVRDisplays()
        .then(function(displays) {
          if (displays.length > 0) {
            showEnterVR(displays[0]);
          } else {
            showVRNotFound();
          }
        })
        .catch(showVRNotFound);

      return button;
    } else {
      var message = document.createElement('a');
      message.href = 'https://webvr.info';
      message.innerHTML = 'WEBVR NOT SUPPORTED';

      message.style.left = 'calc(50% - 90px)';
      message.style.width = '180px';
      message.style.textDecoration = 'none';

      stylizeElement(message);

      return message;
    }
  },

  // DEPRECATED

  checkAvailability: function() {
    console.warn('WEBVR.checkAvailability has been deprecated.');
    return new Promise(function() {});
  },

  getMessageContainer: function() {
    console.warn('WEBVR.getMessageContainer has been deprecated.');
    return document.createElement('div');
  },

  getButton: function() {
    console.warn('WEBVR.getButton has been deprecated.');
    return document.createElement('div');
  },

  getVRDisplay: function() {
    console.warn('WEBVR.getVRDisplay has been deprecated.');
  }
};
