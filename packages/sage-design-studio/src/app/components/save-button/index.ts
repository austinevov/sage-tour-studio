import Component from '../../reactor/component';
import reactor from '../../reactor';

export default class SaveButton extends Component {
  private _button: HTMLButtonElement;
  constructor(root: HTMLDivElement) {
    super(root, 'ev-save-button');

    this._button = document.createElement('button');
    this._button.innerText = 'Save';
    this._parent.appendChild(this._button);

    this._button.onclick = () => {
      reactor.save();
    };
  }

  public react = (stimulus: any): void => {};
}
