import Panorama from './scene/Panorama';
import { changeQuality, QUALITY } from './SageTourInternal';

const FULLSCREEN_B64 = `data:image/png;base64,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`;
const PLUS_B64 = `data:image/png;base64,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`;
const MINUS_B64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAEgElEQVR4nO2cMYuXRxDGn/lzqIhFkJBC5D6ICEqaNH4MC7uQwiKfIoUkn0MrG0urRMQ6pAgWIiIhWMgV5ibF8R7r3DOz+wYyKfI81fvfd3Z39rezs/P3vDOHQ/r3dfivHfi/SKCbJNBNEugmCXSTBLpJAt0kgW6SQDdJoJsk0E0S6CYJdJMEukkC3SSBbpJAN0mgmyTQTRLoJgl0kwS6SQLdJIFukkA3SaCbJNBNEugmCXSTBLpJAt0kgW6SQDfpqHrpp37FzL52928A3DSzK6W9O8wM7p//FoGZffY+2m/Po201PhuL2c7Gq8ZdaDsF8N7MfgHwGIY31RyW/mqF4xqAHwHcA3ANwJG7HzbnVxcSndwDgI2zMkdlz/wYA2PnHJ8AnJjZr+7+rR3seeY/B30G+QcA9ysHVx2qlI23d0OqeavozMBnG1D0f2Nmd2D4jfmX5ei7AO6xiSrAzC6mkSgzo7ZjezaOu9MNGdtn4EdYbI3Rj7E9jHfD3R/COdMM9B0AX7CFsjxbPY+RsQGI0CrbOG614LGtOiHbPNkmRcUAiH2HDbrl7teZnxnoGwAujWDYJRePT4yE7DlCYLZZJEXFjWOXbZbGZm3ZKS58u2pmX7EXGeij+C6DWW0CW0QV0ezd1i+rZmbRGzW7E9hzdqJI+wFJJUdBM2dYHq1u6ywaq4ieRfHqxbhyYtimZZtQVS+snamuo5NyaYzumEer0qlyntXU4xjxHasCon12OsY5xza21mo9DHYWDCXobJdZ+0p+ns0Vn/dE2GrbXr8izNV+UcsRPU6U1aWrYlGXRS7zJfnycD5OFdVVpFenMvbLTl+mpYhmi6ny+AijGps5Fy/dWY07m6tKUZVtlkaWxsdFO3oZriyGwdieMwey51mdOuvPcmemlQsslrWsPX6uKh0giehZXh4XGD/PomWWjlZqXubXaorL1pqte49f5/1XI3ocIO5WVmmsagYky9F7x5zZjO3VZbcnbVSiEV3l3Vn7P1GWR7MIG/tlF1R1uuJcmR/Mppq3mi/7wnIC4JTlz2zAKifHtj35NMv940mYXcKVL1v/LM9XdiQATgGcsLVkl+HvW4eYKsbLqvpiUrWxMi0DMfZlz7FtOY9OqpHZRrINd/c/Aby94ADyHP0UwDv2YuVSGBfE7KovO9vn1VwdT11lVylbU7bhyUl/AsMHNn4G+iWARzg7CmUNGxWP2tieLTaWS+x5bIuLZKeMzctOZFWusTJ0LPuC3c8AfuI4Uf4o6wjAA3f/DsCXZnbhX/RG5yM0OhnJt7P0E+3j3Mxu7M8uVpayqkgtLuBPZvYRwDMA38PwOl17+efYzn5acAzgNoBjd7/Mjj6DW0Fijld5e1b5rI43uzSr8YkPf5nZH+7+AsArOxi9BM/H0t+965H+X0eTBLpJAt0kgW6SQDdJoJsk0E0S6CYJdJMEukkC3SSBbpJAN0mgmyTQTRLoJgl0kwS6SQLdJIFukkA3SaCbJNBNEugmCXSTBLpJAt0kgW6SQDdJoJsk0E0S6CYJdJP+Bqq1PvQ3JHT0AAAAAElFTkSuQmCC`;
const SHRINK_B64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAJTklEQVR4nO1dTYgcxxl9bxiWRYhlWYwRRixiUYQxOTg+hBxN0MHxQQizKEYsJrcQx/kxkhIbsRGDWIRRhGR7k5BriJ0czGbjGEwiRcZXHxxCTraEIsuKEDpIqx9kI62+l0N3r2prqnp6Zlo7W7vziqV7+qe65vU3X7/vq+paCsIQjx6NQTdgs2BI9BphSPQaYUj0GqE56AYkA2ELgN0AtgNYBHAVhHVx/rB0LNKEmc2Z2U1JDyT9U9LTZtaoWsegv8L6L9KopGNmdkMPcV/S383sm1XrGfTXWN9Fakp6TdJtSTIzFUszuy/pYzN7vEpdg/4q67aY2XjuLm4rAjN7IOkjSU9JKnUjA/9C67JI45LmJN2IEOyu3zezDyU9XUb2UHX4yDg5IOllAOPuLpKQtGpJsilpNzKp/CMAF0LVDnW0C2EUwC8A/BQ5ySTbD8tJdtBEJv1mY1UPLbqAMIHMkl8BMFYQKWVJt+JziPgcDWQaO4gkiZapQXIbgJ2SbpH8HMTd3ivEKIADAF4mOebuihHrWnW+vAjgZMk10ipm1pT0nJmdlvSZpH9LelPSZI8PvqaZvZYHI9EHn/sADOALSTOSmrHrDJy4Hoh5UtL/JD3I9ayUBRB/lbSjm7rMbExSy8xuekpiZen++Tcg/ztnZtNlJCdJtJkd9L+8Q8JfzGyqUk3SuJkdVS7hfFL9+iOfv5C0p8r1Bk5c10U6EdCyrmW/I2lnhzqaklrydHKIzNh+Sf+VNFO13YOmretiZidjjjIn4isze0fS9sj5I2Z2UFLQJ7s3MeaXc0uekTSyoYn2rS3yk/+wjWxpQtLRguQQkZ18sqRzqugu3JJcwJJHY6tkl7vN2f4cgDcgTAEo8smvSnpF0pj0sFO6WJenmSX52y4BOAzi/W7bnaaObo/MYse9QNJkakGYRhbxjQFou1HF0r0B3jUukZyVtEB0vraPJIn2SY4RT3IUwD4A3wGwjeTW0Hnygg+/PkkXSB6WtMAGl3tpc3JE+z9vf19g+wjJna578MNpj9RVS2Tu4gCIxV4suUByPhqIh8Vl+YgyVxNzFyQvkZxlg4u9trVAchYNtFuunwDy4R/r/ipK/P1lAEcA/LmONidHdCf/XDUJVEY2yQsADgFY7KqnuwTJEe2iTJYV6PCQW5GEzjmXSb4OYqHOtibno0vkV5vuDZFa9jAtfLKkWkkGEiQ6BJdUn2D3mGLpu40clwDMSnq3VwlXhqRdR4GYlZa5igI52fdIngDxh34kXBmSs+hQF1MnTe1bsOvb8/UGgG+thOuPAMlZdMgqgXZrLlMiAb3dBLBPEmA4zAav1N3uJC3atUoAbVbqb4sd426XtAXADMm3ZXqi7nYnR7TvEnz/7I25WDmmk9Z2xmi8QPINmXbU2e7kXEeBitm7YFRY5t/zz9MAliG0QFyso73JWTTQHmr7n2MPx2KfS3DE7YySfBFAC8K2OtqcJNGxvHEVwguErNpbjgJ4CcDvZOqb7CSJBsKa2V36+8qiROeBGLLuPQBaMj3WT3uTJRpYTW6sl6TY5n/2z3H/vH0NAHtJ7u6nrSk+DA3oTK7vWqqkRkOheU7+hKRd/USNyRFN8jPfkmMEFceEPpfdCP94kndJXuun3Sm6jjMkPwWq96S4/rdTROmfly8/BXC2n0anSPRFAD8juSjpDtCuh/31iKoIuYhVFyJ5h+QHJH8C4Hw/jabQ40v32ZiQpyQdI/ksgK2hn2mVwKKt6vbz7kj6B8njAD6pq9djLdEP0bsk/R7As0C8B6PTPnd/sV7sD+jjT0h+v65obS3Rj+vYTfKZ0E/Tha8IQrnjsuSP99P+NoDv9tHmgaFn1SHpMQBbylxDJ1lVRSUE8I1e2zxI9GzRJD8neT0UXbmfQw+ZKgFF7HhJyUlSoD/XcVbSIkkD2l2BG2V1g7LIrtu61hN6J5q4hmyAyQe+9XZSHSGXEUKI8F5UzHpAXzqaDV4F8EMAfyT5tbsvluSJPexCPSKh7amif39HXKU4C2BZ0ovMRnBGLa/K9pAbSh31RIaZrm2RXADiifmqvjaW6kwZ9YXgxEVJhyS9T2YDUGJ+uBsVshGsGag518EGr5D8saR3AdztRXUA7QEMEO79Tgn1J5WIyyRbkt4DsFzFIqsGKylb96PJ3hEXAPxL0kryp4olVk17poj6oyxhNFcfrwIYWbWrpGcj1vMRS8inhnqJziYV2U/yCIDJslxvx6oqBDQpoVbXIWlaUgvAZLGtG6L8iDIkBzf3w1BoyDRNco7kyuQgnUgu61B1t20Eudc/0dmkIj8g+SaAqSoSzM2NlPnn0Hmpog6L3ocsufQEUP6yToGyfjx3faNYM9An0TLtlTQHxycD/cu00PABf19q6I1oYQTCfgAnXJ9cekp7du6OpPMA7pWRl7IVu+ieaKEpaT+AY0D1VxE8FbFE8iiA7wF4D8DX/vGbPk2qbKB2S9Jkj9Z2HcA8gHk2eFemIyQbeZADoN1fl3WLpYLuLFrYS/IYgFUkd2FxtwD8FsDJYvo0Nnhe0i9JnomdlDLBK6g0f4o0YmYvmdmXodlZKuKmpIOKTY8jbZf0J0lfdaj/eD1z2axtqWTRkvaRbJHc3imXHIriJC0BOAXgFIh7wYsQl5FNObkAYNULla6/BtIbpQSggkVLe5RNoCep0sRO/qYbymbkGq9y581sStkcdrG6fz5o6+yllBHcVJa7OBeaLCpGurd+Q9KvJI111SxpStLflE2v5tb3paRdgyatNqLNrGlmM2WWXMFP31Q2m3jpDIclZE9KelvSf/KbfVrS8z3XN+ASHuQoPC/pNyR3dOWGHobMS5LmSc6B7Rq5C7+2FcCTALYiGzZ7JcWRpEBsNKlwWtnk06WJ+ghuAXgLmYS7XltLE0csYLmC7Om+okpcckvGXdxCFjGe6suSNyBi8q6F7FWCZZUkeDwsAXhL0q+HJLcjRvRFkodIninGaAClWbklSfMAjj+KSUU2BGJPSTNrKPu3Fx8pn6s5pDbM7LaZzamiTt6speMBZva4mX3sa9oct82sdwm3iUrHEJwNXstHH53F6tB4CcA8yVMghu6iEyrdD6lhZs8o+2dcD/Kp2ufMbGLQlpJKqf5WltCQtI3kXmQzap3t6z9FbDL0/vrbEF0hxTdnk8SQ6DXCkOg1wpDoNcL/AaiLdUTTdaDWAAAAAElFTkSuQmCC`;
const WRENCH_B64 = `data:image/png;base64,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`;
const CHECK_B64 = `data:image/png;base64,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`;
export default class DisplayBar {
  private _container: HTMLDivElement;
  private _nameSpan: HTMLSpanElement;
  private _floorSpan: HTMLSpanElement;
  private _floorDown: HTMLImageElement;
  private _floorUp: HTMLImageElement;
  private _zoomInButton: HTMLImageElement;
  private _zoomOutButton: HTMLImageElement;
  private _vrButton: HTMLImageElement;
  private _qualityButton: HTMLImageElement;
  private _buttonContainer: HTMLDivElement;
  private _floor: number;
  private _minFloor: number;
  private _maxFloor: number;
  private _qualityMenu: HTMLDivElement;
  private _lowQuality: HTMLDivElement;
  private _normalQuality: HTMLDivElement;
  private _bestQuality: HTMLDivElement;
  private _lowCheck: HTMLImageElement;
  private _normalCheck: HTMLImageElement;
  private _bestCheck: HTMLImageElement;
  private _isQualityMenuOpen: boolean;
  private _tooltipContainer: HTMLDivElement;
  private _tooltip: HTMLSpanElement;
  private _isFullscreen: boolean;

  constructor(
    parent: HTMLDivElement,
    minFloor: number,
    maxFloor: number,
    onZoom: (delta: number) => void,
    onFloorChange: (floor: number) => void,
    onFullscreen: (state: boolean) => void
  ) {
    this._isQualityMenuOpen = false;
    this._floor = 0;
    this._isFullscreen = false;
    this._minFloor = minFloor;
    this._maxFloor = maxFloor;
    this._container = document.createElement('div');
    this._container.className = 'ev-display-bar';
    parent.appendChild(this._container);

    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.className = 'ev-tooltip';
    this._tooltip = document.createElement('span');
    this._tooltipContainer.appendChild(this._tooltip);
    this._tooltip.innerText = 'Settings';
    parent.appendChild(this._tooltipContainer);

    this._qualityMenu = document.createElement('div');
    this._qualityMenu.className = 'ev-quality-menu';
    this._lowQuality = document.createElement('div');
    this._normalQuality = document.createElement('div');
    this._bestQuality = document.createElement('div');
    const lowQuality = document.createElement('span');
    const normQuality = document.createElement('span');
    const bestQuality = document.createElement('span');
    lowQuality.innerText = 'Performance';
    normQuality.innerText = 'Balanced';
    bestQuality.innerText = 'Best';
    this._lowQuality.appendChild(lowQuality);
    this._normalQuality.appendChild(normQuality);
    this._bestQuality.appendChild(bestQuality);
    const qualityHeaderContainer = document.createElement('div');
    qualityHeaderContainer.className = 'quality-header';
    const qualityHeader = document.createElement('span');
    qualityHeader.innerText = 'quality';
    qualityHeaderContainer.appendChild(qualityHeader);
    this._qualityMenu.appendChild(qualityHeaderContainer);
    this._qualityMenu.appendChild(this._bestQuality);
    this._qualityMenu.appendChild(this._normalQuality);
    this._qualityMenu.appendChild(this._lowQuality);
    this._lowCheck = document.createElement('img');
    this._normalCheck = document.createElement('img');
    this._bestCheck = document.createElement('img');
    this._lowCheck.src = CHECK_B64;
    this._normalCheck.src = CHECK_B64;
    this._bestCheck.src = CHECK_B64;
    this._lowQuality.appendChild(this._lowCheck);
    this._normalQuality.appendChild(this._normalCheck);
    this._bestQuality.appendChild(this._bestCheck);

    parent.appendChild(this._qualityMenu);

    const floorControlContainer = document.createElement('div');
    this._floorSpan = document.createElement('span');
    floorControlContainer.className = 'floor-control-container';
    this._floorDown = document.createElement('img');
    this._floorDown.src =
      'https://s3.amazonaws.com/assets.sagetourstudio/icons/nav-down.png';
    this._floorUp = document.createElement('img');
    this._floorUp.src =
      'https://s3.amazonaws.com/assets.sagetourstudio/icons/nav-up.png';

    floorControlContainer.appendChild(this._floorSpan);
    floorControlContainer.appendChild(this._floorDown);
    floorControlContainer.appendChild(this._floorUp);

    this._container.appendChild(floorControlContainer);

    this._nameSpan = document.createElement('span');
    this._nameSpan.className = 'tour-name';
    this._nameSpan.innerText = name;
    this._container.appendChild(this._nameSpan);

    this._buttonContainer = document.createElement('div');
    this._buttonContainer.className = 'button-container';

    this._zoomInButton = document.createElement('img');
    this._zoomOutButton = document.createElement('img');
    this._vrButton = document.createElement('img');
    this._qualityButton = document.createElement('img');
    this._vrButton.className = 'vr';
    this._zoomInButton.src =
      'https://s3.amazonaws.com/assets.sagetourstudio/icons/zoom-in.png';
    this._zoomOutButton.src =
      'https://s3.amazonaws.com/assets.sagetourstudio/icons/zoom-out.png';
    this._vrButton.src =
      'https://s3.amazonaws.com/assets.sagetourstudio/icons/vr.png';
    this._qualityButton.src = WRENCH_B64;
    this._buttonContainer.appendChild(this._qualityButton);
    this._buttonContainer.appendChild(this._zoomOutButton);
    this._buttonContainer.appendChild(this._zoomInButton);
    this._buttonContainer.appendChild(this._vrButton);

    this._vrButton.onclick = () => {
      window.location = (String(window.location).replace(
        '/v/',
        '/vr/'
      ) as unknown) as Location;
    };

    this._zoomInButton.onclick = () => {
      onZoom(-5);
    };

    this._zoomOutButton.onclick = () => {
      onZoom(5);
    };

    this._floorDown.onclick = () => {
      onFloorChange(this._floor - 1);
    };

    this._floorUp.onclick = () => {
      onFloorChange(this._floor + 1);
    };

    this._qualityButton.onclick = () => {
      this.toggleQualityMenu();
    };

    this._normalQuality.onclick = () => {
      this.setQuality('normal');
    };

    this._bestQuality.onclick = () => {
      this.setQuality('best');
    };

    this._lowQuality.onclick = () => {
      this.setQuality('low');
    };

    this.registerTooltipHover(this._qualityButton, 'Quality');
    this.registerTooltipHover(this._vrButton, 'VR');
    this.registerTooltipHover(this._zoomOutButton, 'Zoom Out');
    this.registerTooltipHover(this._zoomInButton, 'Zoom In');

    this._container.appendChild(this._buttonContainer);
    this.setQuality(QUALITY);
  }

  private registerTooltipHover = (el: HTMLElement, tooltip: string): void => {
    el.onmouseover = () => {
      if (!this._isQualityMenuOpen) {
        this._tooltip.innerText = tooltip;
        this._tooltipContainer.style.left = `${el.offsetLeft + 5}px`;
        this._tooltipContainer.style.display = 'block';
      }
    };

    const stopHovering = () => {
      if (this._tooltip.innerText.toLowerCase() === tooltip.toLowerCase()) {
        this._tooltip.innerText = '';
        this._tooltipContainer.style.display = 'none';
      }
    };

    el.onmouseout = () => {
      stopHovering();
    };
    el.onmouseleave = () => {
      stopHovering();
    };
  };

  private toggleQualityMenu = (): void => {
    this._isQualityMenuOpen = !this._isQualityMenuOpen;

    this._qualityMenu.style.display = this._isQualityMenuOpen ? 'flex' : 'none';
    const left = this._qualityButton.offsetLeft;
    const width = this._qualityButton.clientWidth;

    this._qualityMenu.style.left = `${left -
      width / 2 -
      this._qualityMenu.clientWidth / 2}px`;

    if (this._isQualityMenuOpen) {
      this._tooltip.innerText = '';
      this._tooltipContainer.style.display = 'none';
    }
  };

  public setPanorama = (pano: Panorama): void => {
    this._nameSpan.innerText = pano.name().replace('_', ' ');
    this.setFloor(pano.floor());
  };

  public setQuality = (quality: string): void => {
    if (quality === 'low') {
      this._lowCheck.style.visibility = 'visible';
      this._normalCheck.style.visibility = 'hidden';
      this._bestCheck.style.visibility = 'hidden';
    } else if (quality === 'normal') {
      this._lowCheck.style.visibility = 'hidden';
      this._normalCheck.style.visibility = 'visible';
      this._bestCheck.style.visibility = 'hidden';
    } else if (quality === 'best') {
      this._lowCheck.style.visibility = 'hidden';
      this._normalCheck.style.visibility = 'hidden';
      this._bestCheck.style.visibility = 'visible';
    }

    changeQuality(quality);
  };

  public setFloor = (floor: number): void => {
    this._floor = floor;
    this._floorSpan.innerText = `Floor ${floor}`;

    if (floor === this._minFloor) {
      this._floorDown.style.display = 'none';
    } else {
      this._floorDown.style.display = 'block';
    }

    if (floor === this._maxFloor) {
      this._floorUp.style.display = 'none';
    } else {
      this._floorUp.style.display = 'block';
    }
  };
}
