export default class Label {
  private _container: HTMLDivElement;
  private _text: HTMLSpanElement;

  constructor(parent: HTMLDivElement) {
    this._container = document.createElement('div');
    this._container.className = 'ev-bubble-label';
    parent.appendChild(this._container);

    this._text = document.createElement('span');

    this._container.appendChild(this._text);
  }

  public toggleVisibility = (state: boolean) => {
    if (state) {
      this._container.style.visibility = 'visible';
    } else {
      this._container.style.visibility = 'hidden';
    }
  };

  public setText = (text: string) => {
    this._text.innerText = text;
  };
  public setFontSizeFromDistance = (distance: number) => {};
  public setPosition = (x: number, y: number) => {
    const width = this._container.clientWidth;
    const height = this._container.clientHeight;

    this._container.style.left = `${x - width / 2}px`;
    this._container.style.top = `${y - height / 2}px`;
  };
}
