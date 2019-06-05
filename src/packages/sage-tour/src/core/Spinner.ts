export default class Spinner {
  private _spinner: HTMLDivElement;
  constructor(parent: HTMLDivElement) {
    this._spinner = document.createElement('div');
    this._spinner.className = 'lds-dual-ring';
    this._spinner.style.visibility = 'hidden';
    parent.appendChild(this._spinner);
  }

  public show = () => {
    this._spinner.style.visibility = 'visible';
  };

  public hide = () => {
    this._spinner.style.visibility = 'hidden';
  };
}
