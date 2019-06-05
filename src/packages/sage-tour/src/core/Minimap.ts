import { FloorData, PanoramaAccessorFromId } from './types/index';

import './style/style.scss';
import Panorama from './scene/Panorama';
import { MAX_FOV } from './controllers/TourController';
import { FORCE_LD } from './SageTourInternal';
import mobile from 'is-mobile';

const UP_ARROW_B64 =
  'data:image/png;base64,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gDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsEQAAVjqBnuBgDIBBKAMnHIQsETg/wJXs1s5NPVNAAAAAElFTkSuQmCC';
const DOWN_ARROW_B64 =
  'data:image/png;base64,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';
const LEFT_ARROW_B64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAFlElEQVR4nO2dwWtdRRSHv/sIIYTgootQgoRSREJ5lOIiBClFQolSpIiUKqUtQTRkISK6cO0f0HUXIipBRIqLIiIiRcRFwbZWG9oHhrQ8QighPEo3arTmujhzvdcneX0vb86cublvHpfu7pzz9eQ3M2fOzE1SUgZNv9WsDahKG4AO1AagA7UhawNCtIRkGAmqbeBRSrod2oY9HdEJyVBCMgd8D7SAG8DZhGQsuDHpHv0hf60ngRUgLTz3gbeBWlB7rIGoOCV/qScc5L/bQKfAA2AeGApmkzUU7w5JJB9HpKIdcPFpAW8Co0Hssgbj1RmJ5BeA24+BXJSRxSC2WcPx5ohAPt5BLjpF9llgWNU+a0BenBC5mAXWegD8v8gGRtRstIbUtwMSybPALz1GcvuzDpxXs9MaVF/GC+Sju5CLTpF9RkNGzGHt2nCRi+eAhgfAxacJvIjneXaZV4bTwAXgac/vnQReAYZ9vrR0uY6EpAYcAZaAA+ikESbxzKZUEe0gPwt8CBxEx/5t4GfgT58vLRVoJJIvAIcV+7gFLKWkXkGbD2pdDnw1BG57gsj3cxP5z/SecDKH2CXkGeBqAMhH1fywBtkF6CkH+S9FyA1gDsVsnjHGjoAzuVhWjuQGcETdH2ugHUA/g+yM+Fjx7fQsA3NB/LEGugPkyQBysYqkVIMk/w0wdgScycU1ZblYBaaD+mYNtw10HbiiHMkNZC+xmnuGwHgAuWgie4mqSf4oQTu5qAPfBZCLWTM/IwD9FPC1ciSvAKcIuOsdFWhgIoAm30fyy8Hlwhy0k4spF8ma8+RV4KQlYGvQTwJfKUdyE3jVOpLNQDvIXypDbmE0u4gCNLLtdFkZ8j3gjDVYM9DAPgd5SxHyBlIMo1afETVoJxeX0B34NjGewpmCRjZQLynLxRqBq0OjAg2MOciacpGV4AapCo0OtJOLz5QjeRM4H3Mkq4JGVnyfKkfyOrBAhANfENBOLj5ShrwFvB67XKiBBvYDnwSQiwUC55OjAY2UUL0D/K4MOdhxCJ8/n5VKI8Dz7l+Ntg28D3yckv6m1Ida810Spn1QclT5/WrNJ+g/kLSnVrTVgPeARZMDmf02nzqE7Pt9gO6MowW8RVUHwwLsEeAiuoPiloM9Zg3QDLSDPY7UMGvC3nCwq7lgKcCeQBYu2gn+Baq6BC/AHkWOQGhG9kPkjGDUMqLfgSSXltDPeyzGHNlhOsmTTJoy8oAAR42jBu1gP4HkprWX6FEmm8J2JiepPleO7DXgNWuwpqAd7P3AF8qwHyL7h9HIiE2nOWztAXKeSObZdh1LceNldHfGm8Bpa8imoB3scfQrSTeAl61lxLDrf2EfQL+w5h5yPUQ1y3Yd6Kyy9BtF0JmMnKgs6ALwfchxN00ZWbeSkcDdPRb2FPrlvFn1fzUPCznQNeAQ8EMAGVE79x096ALwCeTwkHah+kuhZMQAY9ewDwPfojvPbhDo6IUBwq5BZzJyQ1lGVghwitYEYo/AD6I/G1lBTm5V7xqJAuga+U0HmpF9G8UDn6YQe4R9yMHQvlZihipe9dMGvI5M/TRlZBmY8W172W4JuwO8C/yk2EcdOJeQeK0hLBXoVD6CcB14A/gVvVq/OlW+YBAEdkp6CzgH/IgO7LvAI58vLB3oQruOyMgdz++9i5y9qd4Fgzv9kECZRlZ4PmYjayhl98xh9e1Afof0tT5hN4FTanZag/LiRA57dZeQs41ctQSTOSRvjgjsY/S+qNnUkov/2GcNyKsz+X3/N3vQ5PkgtlnD8e6QzH+PIbvfnSBvIOVjQeo+zMGoOJV/k2Wn2UgLuZ1m8Amnvh3LvzLU/rGFrMS3unuG3p3Lv2xxxQ16V4HTGFSbJs6gPd1i+HBkJUDH0Mqc6yhVG4AO1AagA7V/AOAKjXTejFQeAAAAAElFTkSuQmCC`;
function mapNumberToName(number) {
  const lut: string[] = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten'
  ];

  if (number >= lut.length) {
    return '' + number;
  }

  return lut[number];
}

export const VIEW_DISTANCE = 2.0;

export default class Minimap {
  private _floorData: FloorData;
  private _floor: number;
  private _mapSVG: SVGElement;
  private _mapSVGImage: SVGElement;
  private _transform: SVGGElement;
  private _panoramaAccessor: PanoramaAccessorFromId;
  private _container: HTMLDivElement;
  private _activePanorama: Panorama;
  private _floorSpan: HTMLSpanElement;
  private _label: HTMLSpanElement;
  private _directionTransform: SVGGElement;
  private _directionIndicator: SVGPolygonElement;
  private _fov: number;
  private _theta: number;
  private _slider: HTMLDivElement;
  private _isToggled: boolean;
  private _name: string;
  private _isHovering: boolean;
  private _popup: HTMLDivElement;
  private _popupLabel: HTMLSpanElement;

  constructor(
    parent: HTMLElement,
    floorData: FloorData,
    panoramaAccessor: PanoramaAccessorFromId,
    name: string
  ) {
    this._isToggled = true;
    this._isHovering = false;
    this._panoramaAccessor = panoramaAccessor;
    this._activePanorama = undefined;
    const [xSpan, ySpan] = floorData.floorplanDimensions;
    this._fov = 90;
    this._theta = 0;
    this._name = name;
    this._floorData = floorData;
    this._container = document.createElement('div');
    this._container.setAttribute('class', 'sage-tour--minimap');
    this._popup = document.createElement('div');
    this._popup.setAttribute('class', 'ev-minimap-popup');
    parent.appendChild(this._popup);
    this._popupLabel = document.createElement('span');
    this._popup.appendChild(this._popupLabel);
    this._popupLabel.innerText = '';

    const mapContainer: HTMLDivElement = document.createElement('div');
    mapContainer.setAttribute('class', 'map-container');

    this._mapSVG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );

    this._transform = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    this._mapSVG.setAttribute('class', 'map-svg');
    this._mapSVG.setAttribute('viewBox', `0 0 ${xSpan} ${ySpan}`);
    mapContainer.appendChild(this._mapSVG);
    this._mapSVG.appendChild(this._transform);

    this._mapSVGImage = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'image'
    );
    this._mapSVGImage.setAttribute('class', 'map-svg-image');
    this._mapSVGImage.setAttribute('width', '100%');
    this._mapSVGImage.setAttribute('height', '100%');
    this._mapSVGImage.setAttribute('x', '0');
    this._mapSVGImage.setAttribute('y', '0');
    this._transform.appendChild(this._mapSVGImage);
    this._directionTransform = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    this._transform.appendChild(this._directionTransform);
    this._directionIndicator = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );
    this._directionIndicator.setAttribute('class', 'ev-direction-indicator');
    this._directionIndicator.setAttribute('fill', 'greenyellow');
    this._directionIndicator.setAttribute('opacity', '0.5');

    this._directionTransform.appendChild(this._directionIndicator);

    // const floorControlContainer: HTMLDivElement = document.createElement('div');
    // floorControlContainer.setAttribute('class', 'floor-control-container');
    // this._container.appendChild(floorControlContainer);

    // const downButton: HTMLImageElement = new Image();
    // const upButton: HTMLImageElement = new Image();
    // downButton.onclick = evt => {
    //   evt.preventDefault();
    //   evt.stopPropagation();
    //   const event = new CustomEvent('change_floor', {
    //     detail: { floor: this._floor - 1 }
    //   });

    //   document.dispatchEvent(event);
    // };
    // upButton.onclick = evt => {
    //   evt.preventDefault();
    //   evt.stopPropagation();
    //   const event = new CustomEvent('change_floor', {
    //     detail: { floor: this._floor + 1 }
    //   });

    //   document.dispatchEvent(event);
    // };
    // downButton.src = DOWN_ARROW_B64;
    // upButton.src = UP_ARROW_B64;
    // floorControlContainer.appendChild(upButton);

    // this._floorSpan = document.createElement('span');
    // this._floorSpan.className = 'floor-number';
    // floorControlContainer.appendChild(this._floorSpan);
    // floorControlContainer.appendChild(downButton);

    this._label = document.createElement('div');
    this._label.className = 'location-label';
    this._label.innerText = this._name;
    this._container.appendChild(this._label);
    this._container.appendChild(mapContainer);

    this._slider = document.createElement('div');
    const sliderIcon = document.createElement('img');
    sliderIcon.src = LEFT_ARROW_B64;
    this._slider.className = 'display-slider';
    this._slider.appendChild(sliderIcon);

    this._slider.onclick = () => {
      this._isToggled = !this._isToggled;

      if (this._isToggled) {
        this._container.style.left = '10px';

        this._slider.className = 'display-slider';
      } else {
        this._container.style.left = `${-this._container.clientWidth}px`;

        this._slider.className = 'display-slider flipped';
      }
    };

    this._container.appendChild(this._slider);

    parent.appendChild(this._container);
  }

  private makeTransform = (): string => {
    const cx = this._floorData.floorplanDimensions[0] / 2;
    const cy = this._floorData.floorplanDimensions[1] / 2;

    const rotationAngle =
      (this._floorData.byFloor[this._floor] as any).theta * 57.2958;

    return `translate(${cx}, ${cy}) rotate(0) translate(-${cx}, -${cy})`;
  };

  private getFloorFromPanorama = (panorama: Panorama): number => {
    return panorama.floor();
  };

  private createPoint = (active: boolean = false): SVGElement => {
    const point: SVGElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    point.setAttribute('class', 'panorama-point');

    return point;
  };

  private startHover = (
    key: string,
    position: { x: number; y: number }
  ): void => {
    const panorama = this._panoramaAccessor(Number(key));
    let { x, y } = position;

    // @ts-ignore
    if (!mobile()) {
      this._popup.style.top = `${y}px`;
      this._popup.style.left = `${x + 15}px`;
      this._popup.style.visibility = 'visible';
      this._popupLabel.innerText = panorama.name().replace('_', ' ');
    }

    this._isHovering = false;
  };

  private endHover = (key: string): void => {
    this._popup.style.visibility = 'hidden';
    this._label.innerText = this._name;
  };

  private createPoints = (floor: number, active: Panorama): SVGElement[] => {
    return (
      Object.keys(this._floorData.byFloor[floor].points)
        .map(pointKey => {
          const x = -this._floorData.byFloor[floor].points[pointKey]
            .floorPosition[1];
          const y = this._floorData.byFloor[floor].points[pointKey]
            .floorPosition[0];

          const r = '2.5%';

          const point: SVGElement = this.createPoint();
          point.setAttribute('cx', '' + x);
          point.setAttribute('cy', '' + y);
          point.setAttribute('r', '' + r);

          const shadowPoint: SVGElement = this.createPoint();
          shadowPoint.setAttribute('class', 'shadow-point');
          shadowPoint.setAttribute('cx', '' + x);
          shadowPoint.setAttribute('cy', '' + y);
          shadowPoint.setAttribute('r', '' + '3%');

          point.onclick = evt => {
            evt.preventDefault();
            evt.stopPropagation();

            const event = new CustomEvent('waypoint_clicked', {
              detail: { panorama: this._panoramaAccessor(parseInt(pointKey)) }
            });

            document.dispatchEvent(event);
          };

          point.onmouseover = evt => {
            const { clientX, clientY } = evt;
            this.startHover(pointKey, { x: clientX, y: clientY });
          };

          point.onmouseout = evt => {
            this.endHover(pointKey);
          };

          if (pointKey === '' + active.id()) {
            point.setAttribute('class', 'panorama-point active');
          }

          return [point];
        })
        //@ts-ignore
        .flat()
    );
  };

  private removePoints = (): void => {
    Array.from(this._transform.childNodes).forEach((node: ChildNode) => {
      const name = node.nodeName.toLowerCase();
      if (name === 'circle') {
        node.remove();
      }
    });
  };

  private setPoints = (floor: number, active: Panorama): void => {
    this.removePoints();
    const points = this.createPoints(floor, active);
    points.forEach(point => {
      this._transform.appendChild(point);
    });
  };

  public setFloor = (floor: number): void => {
    this._floor = floor;

    this._mapSVGImage.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'href',
      this._floorData.byFloor[floor].src
    );

    this._transform.setAttribute('transform', this.makeTransform());

    this.setPoints(this._floor, this._activePanorama);

    this.updateDirectionIndicator();
    // this._floorSpan.innerText = `${this._floor}`;
  };

  public setPanorama = (panorama: Panorama): void => {
    this._activePanorama = panorama;
    const floor: number = this.getFloorFromPanorama(panorama);
    //this._label.innerText = panorama.name().replace('_', ' ');
    this.setFloor(floor);
  };

  public updateDirectionIndicator = (
    theta: number = this._theta,
    fov: number = this._fov
  ): void => {
    this._fov = fov;
    this._theta = theta;
    const rotationAngle = (this._floorData.byFloor[this._floor] as any).theta;

    const correctedTheta = this._theta + rotationAngle + Math.PI / 2;
    const fovRadians = this._fov * 0.0174533;
    const viewDistance = VIEW_DISTANCE;
    const x = viewDistance + viewDistance / 4;
    const y = viewDistance * Math.tan(fovRadians / 2);

    const point = this._floorData.byFloor[this._floor].points[
      this._activePanorama.id()
    ];

    if (point) {
      this._directionTransform.style.visibility = 'visible';

      const px = -point.floorPosition[1];
      const py = point.floorPosition[0];
      const points = `0,0 ${viewDistance},${y} ${viewDistance},${-y}`;
      this._directionIndicator.setAttribute('points', points);
      this._directionTransform.setAttribute(
        'transform',
        `translate(${px}, ${py})  rotate(${correctedTheta /
          0.0174533}, 0, 0) scale(${0.05 *
          this._floorData.floorplanDimensions[0]})`
      );
    } else {
      this._directionTransform.style.visibility = 'hidden';
    }
  };
}
